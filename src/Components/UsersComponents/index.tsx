'use client';

import { useEffect, useState } from 'react';
import InputBox from '../Common/InputBox';
import Button from '../Common/Button';
import UserLists from './UserLists';

type User = { id: string; name: string };

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [editUserId, setEditUserId] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setisLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setisLoading(true);
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                setUsers(data);
            } catch {
                setError('Failed to fetch users');
            } finally {
                setisLoading(false);
                setIsMounted(true);
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        if (editUserId !== null) {
            try {
                const res = await fetch('/api/users', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editUserId, name: trimmed }),
                });
                const data = await res.json();
                setUsers(data.users);
                setEditUserId(null);
            } catch {
                setError('Failed to update user');
            }
        } else {
            try {
                const res = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: trimmed }),
                });
                const newUser = await res.json();
                setUsers(prev => [...prev, newUser]);
            } catch {
                setError('Failed to add user');
            }
        }

        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/users?id=${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            setUsers(data.users);
        } catch {
            setError('Failed to delete user');
        }
    };

    const handleEdit = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setInputValue(user.name);
            setEditUserId(id);
        }
    };

    if (!isMounted) return null;

    return (
        <div className="h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-md sm:max-w-lg max-h-dvh md:max-w-2xl bg-white shadow-lg rounded-xl p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 text-center mb-4 sm:mb-6">User Manager</h1>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 mb-4 sm:mb-6">
                    <InputBox
                        placeholder={editUserId !== null ? 'Edit user...' : 'Add a new user...'}
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <Button
                        onClick={handleSubmit}
                        className="w-full sm:w-auto text-white 
                        bg-gradient-to-br from-purple-600 to-blue-500 
                        hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
                         focus:ring-blue-300 font-medium rounded-lg text-sm px-4 
                         py-2 text-center"
                    >
                        {editUserId !== null ? 'Update' : 'Add'}
                    </Button>
                </div>

                <UserLists
                    users={users}
                    onRemove={handleDelete}
                    onEditStart={handleEdit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default UsersPage;
