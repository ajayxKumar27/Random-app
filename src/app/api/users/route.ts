import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
}

// In-memory store (for demo; not persistent)
let users: User[] = [ ];

// GET: Fetch all users
export async function GET() {
  return NextResponse.json(users, { status: 200 });
}

// POST: Add a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newUser: User = {
      id: uuidv4(),
      name: name.trim(),
    };

    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
  }
}

// PUT: Update a user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name } = body;

    if (!id || typeof id !== 'string' || !name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid ID or name' }, { status: 400 });
    }

    let updated = false;

    users = users.map(user => {
      if (user.id === id) {
        updated = true;
        return { ...user, name: name.trim() };
      }
      return user;
    });

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated', users }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 500 });
  }
}

// DELETE: Remove a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const userExists = users.some(user => user.id === id);

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users = users.filter(user => user.id !== id);

    return NextResponse.json({ message: 'User deleted', users }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
