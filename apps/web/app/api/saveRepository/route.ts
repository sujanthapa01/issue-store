import { prisma } from '@/lib/prismaClient';
import { NextRequest, NextResponse } from 'next/server';

type Repo = {
  id: string | number;
  name: string;
  owner: string;
  fullName: string;
  url: string;
  description?: string;
  isPrivate?: boolean;
  username: string;
  homepage?: string;
  language?: string;
  stars?: number;
  watchers?: number;
  forks?: number;
  topics?: string[];
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Validate required fields
function validateRequiredFields(repo: Repo, fields: (keyof Repo)[]) {
  for (const field of fields) {
    const value = repo[field];
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      return `Missing or empty field: ${field}`;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const repo: Repo = await req.json();

    const requiredFields: (keyof Repo)[] = ['id', 'name', 'owner', 'fullName', 'url', 'username'];
    const validationError = validateRequiredFields(repo, requiredFields);

    if (validationError) {
      return NextResponse.json({ ok: false, msg: validationError }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username: repo.username },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, msg: `User with username '${repo.username}' does not exist` },
        { status: 404 },
      );
    }

    // Check if repo already exists
    const existingRepo = await prisma.repository.findFirst({
      where: {
        id: repo.id.toString(),
        fullName: repo.fullName,
      },
    });

    if (existingRepo) {
      return NextResponse.json(
        { ok: false, msg: `Repository '${repo.name}' already exists` },
        { status: 409 },
      );
    }

    // Create repository
    const createdRepo = await prisma.repository.create({
      data: {
        id: repo.id.toString(),
        name: repo.name,
        owner: repo.owner,
        fullName: repo.fullName,
        url: repo.url,
        description: repo.description ?? null,
        isPrivate: repo.isPrivate ?? false,
        homepage: repo.homepage ?? null,
        language: repo.language ?? null,
        forks: repo.forks ?? 0,
        stars: repo.stars ?? 0,
        watchers: repo.watchers ?? 0,
        topics: repo.topics ?? [],
        avatarUrl: repo.avatarUrl ?? null,
        createdAt: repo.createdAt ? new Date(repo.createdAt) : undefined,
        updatedAt: repo.updatedAt ? new Date(repo.updatedAt) : undefined,

        user: {
          connect: {
            username: repo.username,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, repo: createdRepo }, { status: 201 });
  } catch (error) {
    console.error('Error saving repository:', error);
    const msg = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ ok: false, msg }, { status: 500 });
  }
}
