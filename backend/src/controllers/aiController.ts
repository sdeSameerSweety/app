import { Request, Response } from 'express';
import prisma from '../config/database';
import { getAIResponse } from '../services/aiService';

const AI_QUERY_LIMITS: { [key: string]: number } = {
  FREE: 50,
  STUDENT_PREMIUM: -1,
  PROFESSIONAL_PREMIUM: -1,
  ENTERPRISE_PREMIUM: -1,
};

export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { message, conversationId } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const limit = AI_QUERY_LIMITS[req.user.subscriptionTier];
    if (limit !== -1 && req.user.aiQueriesUsed >= limit) {
      res.status(403).json({
        error: 'AI query limit reached. Please upgrade to premium.',
      });
      return;
    }

    let conversation;
    let messages: any[] = [];

    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
      });

      if (conversation && conversation.userId === req.user.id) {
        messages = conversation.messages as any[];
      }
    }

    messages.push({ role: 'user', content: message });

    const aiResponse = await getAIResponse(messages, req.user.id);

    messages.push({ role: 'assistant', content: aiResponse });

    if (conversation) {
      conversation = await prisma.aIConversation.update({
        where: { id: conversationId },
        data: {
          messages: messages as any,
          tokensUsed: conversation.tokensUsed + 100,
        },
      });
    } else {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: req.user.id,
          type: 'TEXT',
          messages: messages as any,
          tokensUsed: 100,
        },
      });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        aiQueriesUsed: { increment: 1 },
      },
    });

    res.json({
      message: 'Response generated',
      response: aiResponse,
      conversationId: conversation.id,
      queriesRemaining:
        limit === -1 ? 'unlimited' : limit - (req.user.aiQueriesUsed + 1),
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
};

export const getConversationHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const conversations = await prisma.aIConversation.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
};
