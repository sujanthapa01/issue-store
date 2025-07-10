import { NextRequest, NextResponse } from 'next/server';
import { syncRepo } from '@/hooks/syncRepo';

interface ReqType {
  owner: string;
  repo: string;
  github_token: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { owner, repo, github_token }: ReqType = body;

    if (!owner || !repo || !github_token) {
      return NextResponse.json({ ok: false, msg: 'Missing required fields' }, { status: 400 });
    }

    const response = await syncRepo({ owner, repo, github_token });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { ok: false, msg: 'Failed to sync webhook', error },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, msg: 'Webhook synced successfully' });
  } catch (error) {
    return NextResponse.json(
      { ok: false, msg: 'Internal server error', error: String(error) },
      { status: 500 },
    );
  }
}

export default POST;
