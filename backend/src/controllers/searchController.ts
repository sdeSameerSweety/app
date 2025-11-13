import { Request, Response } from 'express';
import prisma from '../config/database';

export const searchColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query,
      state,
      city,
      type,
      minRanking,
      maxRanking,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Text search across name and description
    if (query) {
      where.OR = [
        { name: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } },
        { location: { contains: query as string, mode: 'insensitive' } },
      ];
    }

    // Filter by state
    if (state) {
      where.state = { equals: state as string, mode: 'insensitive' };
    }

    // Filter by city
    if (city) {
      where.city = { equals: city as string, mode: 'insensitive' };
    }

    // Filter by type
    if (type) {
      where.type = { equals: type as string, mode: 'insensitive' };
    }

    // Filter by ranking range
    if (minRanking || maxRanking) {
      where.ranking = {};
      if (minRanking) {
        where.ranking.gte = parseInt(minRanking as string);
      }
      if (maxRanking) {
        where.ranking.lte = parseInt(maxRanking as string);
      }
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        include: {
          _count: {
            select: { reviews: true, courses: true },
          },
        },
        orderBy: { ranking: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.college.count({ where }),
    ]);

    res.json({
      colleges,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      filters: {
        query,
        state,
        city,
        type,
        minRanking,
        maxRanking,
      },
    });
  } catch (error) {
    console.error('Search colleges error:', error);
    res.status(500).json({ error: 'Failed to search colleges' });
  }
};

export const searchCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      query,
      category,
      mode,
      platform,
      minFees,
      maxFees,
      minRating,
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Text search
    if (query) {
      where.OR = [
        { name: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } },
        { category: { contains: query as string, mode: 'insensitive' } },
      ];
    }

    // Filter by category
    if (category) {
      where.category = { equals: category as string, mode: 'insensitive' };
    }

    // Filter by mode (Online/Offline/Hybrid)
    if (mode) {
      where.mode = { equals: mode as string, mode: 'insensitive' };
    }

    // Filter by platform (for online courses)
    if (platform) {
      where.platform = { equals: platform as string, mode: 'insensitive' };
    }

    // Filter by rating
    if (minRating) {
      where.rating = { gte: parseFloat(minRating as string) };
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          college: {
            select: {
              id: true,
              name: true,
              location: true,
            },
          },
          _count: {
            select: { reviews: true },
          },
        },
        orderBy: { rating: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      filters: {
        query,
        category,
        mode,
        platform,
        minRating,
      },
    });
  } catch (error) {
    console.error('Search courses error:', error);
    res.status(500).json({ error: 'Failed to search courses' });
  }
};

export const advancedReviewSearch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      query,
      reviewType,
      collegeId,
      courseId,
      minRating,
      maxRating,
      isVerified,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query as string, mode: 'insensitive' } },
        { content: { contains: query as string, mode: 'insensitive' } },
        { pros: { contains: query as string, mode: 'insensitive' } },
        { cons: { contains: query as string, mode: 'insensitive' } },
      ];
    }

    // Filter by review type
    if (reviewType) {
      where.reviewType = reviewType;
    }

    // Filter by college
    if (collegeId) {
      where.collegeId = collegeId;
    }

    // Filter by course
    if (courseId) {
      where.courseId = courseId;
    }

    // Filter by rating range
    if (minRating || maxRating) {
      where.rating = {};
      if (minRating) {
        where.rating.gte = parseInt(minRating as string);
      }
      if (maxRating) {
        where.rating.lte = parseInt(maxRating as string);
      }
    }

    // Filter by verification status
    if (isVerified !== undefined) {
      where.isVerified = isVerified === 'true';
    }

    // Filter by tags
    if (tags) {
      const tagArray = (tags as string).split(',');
      where.tags = { hasSome: tagArray };
    }

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

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
          _count: {
            select: { comments: true },
          },
        },
        orderBy,
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
      filters: {
        query,
        reviewType,
        collegeId,
        courseId,
        minRating,
        maxRating,
        isVerified,
        tags,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('Advanced review search error:', error);
    res.status(500).json({ error: 'Failed to search reviews' });
  }
};

export const getFilterOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get unique states
    const states = await prisma.college.findMany({
      select: { state: true },
      distinct: ['state'],
      orderBy: { state: 'asc' },
    });

    // Get unique college types
    const types = await prisma.college.findMany({
      select: { type: true },
      distinct: ['type'],
      orderBy: { type: 'asc' },
    });

    // Get unique course categories
    const categories = await prisma.course.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { category: { not: null } },
      orderBy: { category: 'asc' },
    });

    // Get unique course platforms
    const platforms = await prisma.course.findMany({
      select: { platform: true },
      distinct: ['platform'],
      where: { platform: { not: null } },
      orderBy: { platform: 'asc' },
    });

    // Get popular tags
    const reviews = await prisma.review.findMany({
      select: { tags: true },
      take: 1000,
    });

    const tagCount: { [key: string]: number } = {};
    reviews.forEach((review) => {
      review.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const popularTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([tag]) => tag);

    res.json({
      states: states.map((s) => s.state),
      types: types.map((t) => t.type),
      categories: categories.map((c) => c.category),
      platforms: platforms.map((p) => p.platform),
      popularTags,
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({ error: 'Failed to get filter options' });
  }
};

export const getCollegeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          take: 10,
          orderBy: { rating: 'desc' },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                verificationLevel: true,
              },
            },
          },
        },
        _count: {
          select: {
            courses: true,
            reviews: true,
          },
        },
      },
    });

    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    // Calculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { collegeId: id },
      _avg: { rating: true },
    });

    res.json({
      college: {
        ...college,
        averageRating: avgRating._avg.rating || 0,
      },
    });
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ error: 'Failed to fetch college details' });
  }
};
