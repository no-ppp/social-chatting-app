const getUserFromLocalStorage = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            throw new Error('No user found in localStorage');
        }
        const user = JSON.parse(userStr);
        if(!user?.id) {
            throw new Error('No user ID found');
        }
        return user;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}
export default getUserFromLocalStorage;