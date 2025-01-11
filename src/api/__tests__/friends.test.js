import { friendsAPI } from '../friends';

// Mock fetch
global.fetch = jest.fn();

describe('Friends API', () => {
    beforeEach(() => {
        fetch.mockClear();
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token');
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should get friend request successfully', async () => {
        const mockResponse = {
            id: 1,
            sender: {
                id: 2,
                email: 'test2@example.com'
            },
            receiver: {
                id: 1,
                email: 'test1@example.com'
            },
            status: 'pending'
        };

        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            })
        );

        const result = await friendsAPI.getFriendRequest(2);
        expect(result).toEqual(mockResponse);
        expect(fetch).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/api/users/2/friend-request/',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer mock-token'
                })
            })
        );
    });

    it('should accept friend request successfully', async () => {
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ status: 'accepted' })
            })
        );

        await friendsAPI.acceptFriendRequest(2);
        
        expect(fetch).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/api/users/2/accept-friend-request/',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer mock-token'
                })
            })
        );
    });

    it('should reject friend request successfully', async () => {
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ status: 'rejected' })
            })
        );

        await friendsAPI.rejectFriendRequest(2);
        
        expect(fetch).toHaveBeenCalledWith(
            'http://127.0.0.1:8000/api/users/2/reject-friend-request/',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': 'Bearer mock-token'
                })
            })
        );
    });

    it('should handle errors when getting friend request', async () => {
        fetch.mockImplementationOnce(() => 
            Promise.resolve({
                ok: false,
                status: 404
            })
        );

        const result = await friendsAPI.getFriendRequest(2);
        expect(result).toBeNull();
    });

    it('should handle network errors', async () => {
        fetch.mockImplementationOnce(() => 
            Promise.reject(new Error('Network error'))
        );

        const result = await friendsAPI.getFriendRequest(2);
        expect(result).toBeNull();
    });

    it('should handle missing token', async () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

        const result = await friendsAPI.getFriendRequest(2);
        expect(result).toBeNull();
    });
}); 