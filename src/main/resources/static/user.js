// async function getCurrentUser() {
//     try {
//         const response = await fetch('http://localhost:8080/api/user/users');
//         if (!response.ok) {
//             throw new Error('Failed to fetch current user');
//         }
//         const user = await response.json();
//         displayCurrentUser(user);
//     } catch (error) {
//         console.error('Error fetching current user:', error);
//         document.getElementById('current-user-info').textContent = 'Error loading user data';
//     }
// }
//
// function displayCurrentUser(user) {
//     const userInfoElement = document.getElementById('current-user-info');
//     const roles = user.roles ? user.roles.map(role => role.name.replace('ROLE_', '')).join(', ') : 'No roles';
//     userInfoElement.textContent = `${user.username} with role: ${roles}`;
// }
//
// async function getAllUsers() {
//     try {
//         const res = await fetch('http://localhost:8080/api/user/users');
//         if (!res.ok) {
//             throw new Error('Failed to fetch users');
//         }
//         const users = await res.json();
//         renderUsersTable(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         // Можно добавить отображение ошибки в интерфейсе
//     }
// }
//
// function renderUsersTable(users) {
//     const tbody = document.querySelector('#users-table tbody');
//     tbody.innerHTML = ''; // Очищаем таблицу
//
//     if (users.length === 0) {
//         tbody.innerHTML = '<tr><td colspan="9" class="text-center">No users found</td></tr>';
//         return;
//     }
//
//     users.forEach(user => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${user.id}</td>
//             <td>${user.username || ''}</td>
//             <td>${user.lastName || ''}</td>
//             <td>${user.age || ''}</td>
//             <td>${user.email || ''}</td>
//             <td>${user.city || ''}</td>
//             <td>${user.roles ? user.roles.map(role => role.name.replace('ROLE_', '')).join(', ') : ''}</td>
//             <td><button class="btn btn-sm btn-warning">Edit</button></td>
//             <td><button class="btn btn-sm btn-danger">Delete</button></td>
//         `;
//         tbody.appendChild(row);
//     });
// }
//
// // Инициализация при загрузке страницы
// async function init() {
//     await getCurrentUser();
//     await getAllUsers();
// }
//
// window.addEventListener('DOMContentLoaded', init);

async function getCurrentUser() {
    try {
        const response = await fetch('http://localhost:8080/api/user/users');
        if (!response.ok) {
            throw new Error('Failed to fetch current user');
        }
        const user = await response.json();
        displayCurrentUser(user);
        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        document.getElementById('current-user-info').textContent = 'Error loading user data';
        return null;
    }
}

function displayCurrentUser(user) {
    if (!user) return;

    const userInfoElement = document.getElementById('current-user-info');
    const roles = user.roles ? user.roles.map(role => role.name.replace('ROLE_', '')).join(', ') : 'No roles';
    userInfoElement.textContent = `${user.username} with role: ${roles}`;

    // Заполняем таблицу данными пользователя
    renderUserTable(user);
}

function renderUserTable(user) {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = ''; // Очищаем таблицу

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username || '-'}</td>
        <td>${user.lastName || '-'}</td>
        <td>${user.age || '-'}</td>
        <td>${user.email || '-'}</td>
        <td>${user.city || '-'}</td>
        <td>${user.roles ? user.roles.map(role => role.name.replace('ROLE_', '')).join(', ') : '-'}</td>
    `;
    tbody.appendChild(row);
}

// Инициализация при загрузке страницы
async function init() {
    const user = await getCurrentUser();
    if (user) {
        // Если нужно получить дополнительные данные, можно использовать:
        // await getAdditionalUserData(user.id);
    }
}

window.addEventListener('DOMContentLoaded', init);