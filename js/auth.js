
function checkAuth() {
    const isLoggedIn = localStorage.getItem('legal_dashboard_logged_in');
    if (isLoggedIn !== 'true') {
        const currentPath = window.location.pathname;
        let loginPath = 'auth/login.html';
        
        if (currentPath.includes('dropdownListsPages')) {
            loginPath = '../auth/login.html';
        } else if (currentPath.includes('auth/')) {
            if (!currentPath.includes('login.html')) {
                loginPath = 'login.html';
            } else {
                return;
            }
        }
        
        window.location.href = loginPath;
    }
}

/**
 * Handles the login logic.
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean} Success or failure
 */
function login(email, password) {
    if (email === 'admin@admin.com' && password === '123456') {
        localStorage.setItem('legal_dashboard_logged_in', 'true');
        return true;
    }
    return false;
}

/**
 * Logs the user out and redirects to the login page.
 */
function logout() {
    localStorage.removeItem('legal_dashboard_logged_in');
    
    const currentPath = window.location.pathname;
    let loginPath = 'auth/login.html';
    
    if (currentPath.includes('dropdownListsPages')) {
        loginPath = '../auth/login.html';
    } else if (currentPath.includes('auth/')) {
        loginPath = 'login.html';
    }
    
    window.location.href = loginPath;
}

if (!window.location.pathname.includes('login.html') && 
    !window.location.pathname.includes('forgot-password.html') && 
    !window.location.pathname.includes('reset-password.html')) {
    checkAuth();
}
