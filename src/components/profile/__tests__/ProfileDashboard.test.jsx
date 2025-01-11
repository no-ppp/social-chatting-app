import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfileDashboard from '../ProfileDashboard';
import { usersAPI } from '../../../api/users';
import { friendsAPI } from '../../../api/friends';

// Mock APIs
jest.mock('../../../api/users');
jest.mock('../../../api/friends');

describe('ProfileDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'user') return JSON.stringify({ id: 1, email: 'test1@example.com' });
            if (key === 'access_token') return 'mock-token';
            return null;
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render profile with pending friend request buttons', async () => {
        // Mock API responses
        usersAPI.getUserById.mockResolvedValue({
            id: 2,
            email: 'test2@example.com',
            avatar: null,
            status: null
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: 1,
                    sender: { id: 2 },
                    receiver: { id: 1 },
                    status: 'pending'
                })
            })
        );

        render(
            <MemoryRouter initialEntries={['/profile/2']}>
                <Routes>
                    <Route path="/profile/:userId" element={<ProfileDashboard />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('test2@example.com')).toBeInTheDocument();
            expect(screen.getByText('Akceptuj')).toBeInTheDocument();
            expect(screen.getByText('Odrzuć')).toBeInTheDocument();
        });
    });

    it('should handle accept friend request', async () => {
        // Setup mocks
        usersAPI.getUserById.mockResolvedValue({
            id: 2,
            email: 'test2@example.com',
            username: 'testuser'
        });

        // Mock fetch dla sprawdzenia friend request
        const mockFetch = jest.fn()
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    id: 1,
                    sender: { id: 2 },
                    receiver: { id: 1 },
                    status: 'pending'
                })
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ status: 'accepted' })
            }));

        global.fetch = mockFetch;

        // Mock localStorage
        jest.spyOn(Storage.prototype, 'getItem')
            .mockImplementation((key) => {
                if (key === 'user') return JSON.stringify({ id: 1, email: 'test1@example.com' });
                if (key === 'access_token') return 'mock-token';
                return null;
            });

        const { container } = render(
            <MemoryRouter initialEntries={['/profile/2']}>
                <Routes>
                    <Route path="/profile/:userId" element={<ProfileDashboard />} />
                </Routes>
            </MemoryRouter>
        );

        // Poczekaj na załadowanie danych i ustawienie hasPendingRequest
        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument();
            expect(screen.getByText('Zaproszenie do znajomych')).toBeInTheDocument();
        });

        // Znajdź i kliknij przycisk w odpowiedniej strukturze
        const acceptButton = screen.getByText('Akceptuj');
        fireEvent.click(acceptButton);

        // Sprawdź czy został wywołany odpowiedni endpoint
        await waitFor(() => {
            expect(friendsAPI.acceptFriendRequest).toHaveBeenCalledWith('2');
        });
    });
}); 