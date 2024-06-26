const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/;

function validateEmail(email) {
    return regex.test(email);
}
export default validateEmail;

