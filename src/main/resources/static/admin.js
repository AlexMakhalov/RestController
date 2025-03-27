document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:8080/api/admin';
    const USERS_ENDPOINT = `${API_BASE_URL}/users`;
    const ROLES_ENDPOINT = `${API_BASE_URL}/roles`;
    const CURRENT_USER_ENDPOINT = `${API_BASE_URL}/users/current`;

    // Элементы интерфейса
    const userForm = document.getElementById('user-form');
    const rolesSelect = document.getElementById('roles-select');
    const usersTableBody = document.querySelector('#users-table tbody');
    const adminTableBody = document.querySelector('#admin-table tbody');
    const formMessage = document.getElementById('form-message');
    const currentUserInfo = document.getElementById('current-user-info');

    let currentUser = null;
    let deleteUserId = null;

    // Инициализация приложения
    async function initApp() {
        await getCurrentUser();
        await loadRoles();
        await loadAllUsers();

        // Обработчик переключения видимости пароля
        document.addEventListener('click', function (e) {
            if (e.target.classList.contains('toggle-password') || e.target.closest('.toggle-password')) {
                const button = e.target.closest('.toggle-password');
                const input = button.previousElementSibling;
                const icon = button.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'bi bi-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'bi bi-eye';
                }
            }
        });
    }

    // Получение текущего пользователя
    async function getCurrentUser() {
        try {
            const response = await fetch(CURRENT_USER_ENDPOINT);
            if (!response.ok) throw new Error('Failed to fetch current user');

            currentUser = await response.json();
            displayCurrentUserInfo(currentUser);
            renderCurrentUserTable(currentUser);

            return currentUser;
        } catch (error) {
            console.error('Error fetching current user:', error);
            currentUserInfo.textContent = 'Error loading user data';
            adminTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-danger">Error loading user data</td>
                </tr>
            `;
            return null;
        }
    }

    // Отображение информации о текущем пользователе в шапке
    function displayCurrentUserInfo(user) {
        if (!user) return;
        const roles = user.roles ? user.roles.map(role => role.name.replace('ROLE_', '')).join(', ') : 'No roles';
        currentUserInfo.textContent = `${user.username} with role: ${roles}`;
    }

    // Заполнение таблицы данными текущего пользователя
    function renderCurrentUserTable(user) {
        adminTableBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id || '-'}</td>
            <td>${user.username || '-'}</td>
            <td>${user.lastName || '-'}</td>
            <td>${user.age || '-'}</td>
            <td>${user.email || '-'}</td>
            <td>${user.city || '-'}</td>
            <td>${user.roles ? user.roles.map(role => role.name.replace('ROLE_', '')).join(', ') : '-'}</td>
        `;
        adminTableBody.appendChild(row);
    }

    // Загрузка ролей
    async function loadRoles() {
        try {
            const response = await fetch(ROLES_ENDPOINT);
            if (!response.ok) throw new Error('Failed to load roles');

            const roles = await response.json();
            rolesSelect.innerHTML = '';

            roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role.id;
                option.textContent = role.name.replace('ROLE_', '');
                rolesSelect.appendChild(option);
            });

            return roles;
        } catch (error) {
            console.error('Error loading roles:', error);
            showMessage('Error loading roles', 'danger');
            return [];
        }
    }

    // Загрузка всех пользователей
    async function loadAllUsers() {
        try {
            const response = await fetch(USERS_ENDPOINT);
            if (!response.ok) throw new Error('Failed to load users');

            const users = await response.json();
            renderUsersTable(users);
        } catch (error) {
            console.error('Error loading users:', error);
            showMessage('Error loading users', 'danger');
        }
    }

    // Рендер таблицы пользователей
    function renderUsersTable(users) {
        usersTableBody.innerHTML = '';

        if (!users || users.length === 0) {
            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">No users found</td>
                </tr>
            `;
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username || '-'}</td>
                <td>${user.lastName || '-'}</td>
                <td>${user.age || '-'}</td>
                <td>${user.email || '-'}</td>
                <td>${user.city || '-'}</td>
                <td>${user.roles?.map(role => role.name.replace('ROLE_', '')).join(', ') || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-warning edit-btn" data-user-id="${user.id}">
                        Edit
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn" data-user-id="${user.id}">
                        Delete
                    </button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        addEditListeners();
        addDeleteListeners();
    }

    // Обработчики для кнопок редактирования
    function addEditListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const userId = btn.dataset.userId;
                try {
                    const response = await fetch(`${USERS_ENDPOINT}/${userId}`);
                    if (!response.ok) throw new Error('Failed to load user');

                    const user = await response.json();
                    fillEditForm(user);

                    const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
                    editModal.show();
                } catch (error) {
                    console.error('Error loading user:', error);
                    showMessage('Error loading user data', 'danger');
                }
            });
        });
    }

    // Заполнение формы редактирования
    function fillEditForm(user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUsername').value = user.username || '';
        document.getElementById('editLastName').value = user.lastName || '';
        document.getElementById('editPassword').value = user.password || '';
        document.getElementById('editAge').value = user.age || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editCity').value = user.city || '';

        // Сброс и установка ролей
        document.getElementById('editRoleAdmin').checked = false;
        document.getElementById('editRoleUser').checked = false;

        user.roles?.forEach(role => {
            if (role.name === 'ROLE_ADMIN') {
                document.getElementById('editRoleAdmin').checked = true;
            } else if (role.name === 'ROLE_USER') {
                document.getElementById('editRoleUser').checked = true;
            }
        });
    }

    // Обработчики для кнопок удаления
    function addDeleteListeners() {
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteUserId = btn.dataset.userId;
                const username = btn.closest('tr').querySelector('td:nth-child(2)').textContent;
                document.getElementById('deleteUserName').textContent = username;

                const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
                deleteModal.show();
            });
        });
    }

    // Обработчик формы создания пользователя
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(userForm);
        const selectedRoles = Array.from(rolesSelect.selectedOptions).map(option => ({
            id: parseInt(option.value),
            name: `ROLE_${option.textContent}`
        }));

        const userData = {
            username: formData.get('username'),
            lastName: formData.get('lastName'),
            password: formData.get('password'),
            age: parseInt(formData.get('age')) || null,
            email: formData.get('email'),
            city: formData.get('city'),
            roles: selectedRoles
        };

        try {
            const response = await fetch(USERS_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create user');
            }

            userForm.reset();
            await loadAllUsers();
            showMessage('User created successfully', 'success');
            document.getElementById('tab1').click();
        } catch (error) {
            console.error('Error creating user:', error);
            showMessage(error.message, 'danger');
        }
    });

    // Обработчик формы редактирования
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const roles = [];
        if (document.getElementById('editRoleAdmin').checked) {
            roles.push({ id: 1, name: 'ROLE_ADMIN' });
        }
        if (document.getElementById('editRoleUser').checked) {
            roles.push({ id: 2, name: 'ROLE_USER' });
        }

        const userData = {
            id: document.getElementById('editUserId').value,
            username: document.getElementById('editUsername').value,
            lastName: document.getElementById('editLastName').value,
            password: document.getElementById('editPassword').value,
            age: parseInt(document.getElementById('editAge').value) || null,
            email: document.getElementById('editEmail').value,
            city: document.getElementById('editCity').value,
            roles: roles
        };

        try {
            const response = await fetch(`${USERS_ENDPOINT}/${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update user');
            }

            await loadAllUsers();

            const editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            if (editModal) editModal.hide();

            showMessage('User updated successfully', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            showMessage(error.message, 'danger');
        }
    });

    // Обработчик удаления пользователя
    document.getElementById('confirmDelete').addEventListener('click', async () => {
        if (!deleteUserId) return;

        try {
            const response = await fetch(`${USERS_ENDPOINT}/${deleteUserId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            await loadAllUsers();

            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
            if (deleteModal) deleteModal.hide();

            showMessage('User deleted successfully', 'success');
            deleteUserId = null;
        } catch (error) {
            console.error('Error deleting user:', error);
            showMessage('Failed to delete user', 'danger');
        }
    });

    // Показать сообщение
    function showMessage(text, type = 'success') {
        formMessage.textContent = text;
        formMessage.className = `alert alert-${type}`;
        formMessage.classList.remove('d-none');

        setTimeout(() => {
            formMessage.classList.add('d-none');
        }, 5000);
    }

    // Запуск приложения
    initApp();
});