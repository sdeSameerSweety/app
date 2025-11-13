import { Request, Response } from 'express';
import prisma from '../config/database';

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const {
      reviewType,
      collegeId,
      courseId,
      rating,
      title,
      content,
      pros,
      cons,
      tags,
    } = req.body;

    if (!reviewType || !rating || !title || !content) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Rating must be between 1 and 5' });
      return;
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        reviewType,
        collegeId: collegeId || null,
        courseId: courseId || null,
        rating,
        title,
        content,
        pros: pros || null,
        cons: cons || null,
        tags: tags || [],
        isVerified: req.user.isEmailVerified && req.user.verificationLevel !== 'LEVEL_1',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            verificationLevel: true,
            credibilityScore: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      reviewType,
      collegeId,
      courseId,
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (reviewType) where.reviewType = reviewType;
    if (collegeId) where.collegeId = collegeId;
    if (courseId) where.courseId = courseId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              verificationLevel: true,
              credibilityScore: true,
            },
          },
          college: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
        },
        orderBy: { [sortBy as string]: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.review.count({ where }),
    ]);

    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            verificationLevel: true,
            credibilityScore: true,
          },
        },
        college: true,
        course: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!review) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json({ review });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

export const upvoteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    const review = await prisma.review.update({
      where: { id },
      data: {
        upvotes: { increment: 1 },
      },
    });

    res.json({
      message: 'Review upvoted',
      upvotes: review.upvotes,
    });
  } catch (error) {
    console.error('Upvote review error:', error);
    res.status(500).json({ error: 'Failed to upvote review' });
  }
};

export const downvoteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    const review = await prisma.review.update({
      where: { id },
      data: {
        downvotes: { increment: 1 },
      },
    });

    res.json({
      message: 'Review downvoted',
      downvotes: review.downvotes,
    });
  } catch (error) {
    console.error('Downvote review error:', error);
    res.status(500).json({ error: 'Failed to downvote review' });
  }
};
