export const getGuestToken = () => {
    let token = localStorage.getItem("guest_token");
    if (!token) {
        token = crypto.randomUUID(); // generates unique guest ID
        localStorage.setItem("guest_token", token);
    }
    return token;
};
