// --- CÓDIGO DO MENU ---

document.addEventListener('DOMContentLoaded', () => {
    
    const toggle = document.getElementById('menu-toggle');
    const menuMobile = document.getElementById('menu-mobile'); 
    
    // Funcao para alternar o estado ARIA e a classe
    const toggleMobileMenu = (forceClose = false) => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        if (forceClose) {
            menuMobile.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            menuMobile.classList.toggle('active');
            toggle.setAttribute('aria-expanded', (!isExpanded).toString());
        }
        // Fecha todos os submenus ao fechar o menu principal
        document.querySelectorAll('.nav-mobile .dropdown').forEach(d => d.classList.remove('active'));
    };

    // Ação de clique principal: Ativa o menu mobile
    if (toggle && menuMobile) {
        toggle.addEventListener('click', () => {
            toggleMobileMenu();
        });
    }

    // Lógica para submenus (menu mobile) e fechamento ao clicar em link
    const dropdownToggles = document.querySelectorAll('.nav-mobile .dropdown > .dropdown-toggle');
    const menuLinks = document.querySelectorAll('.nav-mobile a:not(.dropdown-toggle)');

    const handleMobileClick = (e, link) => {
        if (window.innerWidth <= 1024) {
            
            if (link.classList.contains('dropdown-toggle')) {
                e.preventDefault();
                const parent = link.parentElement;
                
                // Toggle ARIA para submenus
                const isSubExpanded = link.getAttribute('aria-expanded') === 'true';
                link.setAttribute('aria-expanded', (!isSubExpanded).toString());

                // Fecha outros submenus no menu mobile
                document.querySelectorAll('.nav-mobile .dropdown.active').forEach(d => {
                    const otherLink = d.querySelector('.dropdown-toggle');
                    if (otherLink) otherLink.setAttribute('aria-expanded', 'false');

                    if (d !== parent) {
                        d.classList.remove('active');
                    }
                });
                parent.classList.toggle('active');
            } else {
                // Se for um link de navegação, fecha o menu mobile
                toggleMobileMenu(true); // Força fechar
            }
        }
    };

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => handleMobileClick(e, link));
    });
    dropdownToggles.forEach(link => {
        link.addEventListener('click', (e) => handleMobileClick(e, link));
    });

    // Fecha menu clicando fora
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && menuMobile && toggle) {
            if (!menuMobile.contains(e.target) && !toggle.contains(e.target) && !e.target.closest('.dropdown')) {
                toggleMobileMenu(true); // Força fechar
            }
        }
    });
});


// --- CÓDIGO DE VALIDAÇÃO DO FORMULÁRIO (PARA cadastro.html) ---

// Seleciona o formulário de cadastro no DOM
const formularioCadastro = document.querySelector('form');

if (formularioCadastro) {
    formularioCadastro.addEventListener('submit', function (event) {
        // Assume que o formulário é válido por padrão
        let isValid = true;
        let errorMessage = "Por favor, corrija os seguintes erros:\n";

        // 1. Validação de Campos Vazios
        const requiredFields = [
            'nome', 'email', 'cpf', 'telefone', 'data_de_nascimento', 'endereco', 'cep', 'cidade', 'estado'
        ];

        requiredFields.forEach(fieldName => {
            const input = document.getElementById(fieldName);
            if (!input.value.trim()) {
                errorMessage += `- O campo ${input.name.toUpperCase().replace(/_/g, ' ')} é obrigatório.\n`;
                isValid = false;
            }
        });

        // 2. Validação de E-mail (usando Regex básica)
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput && emailInput.value.trim() && !emailRegex.test(emailInput.value)) {
            errorMessage += `- E-mail inválido. Utilize o formato: nome@exemplo.com\n`;
            isValid = false;
        }

        // 3. Validação de Data de Nascimento (Verifica se é maior de 18 anos)
        const dataNascimentoInput = document.getElementById('data_de_nascimento');
        if (dataNascimentoInput && dataNascimentoInput.value) {
            const dataNascimento = new Date(dataNascimentoInput.value);
            const dataLimite = new Date();
            dataLimite.setFullYear(dataLimite.getFullYear() - 18); // Data limite: 18 anos atrás
            
            if (dataNascimento > dataLimite) {
                errorMessage += `- Você deve ter pelo menos 18 anos para se cadastrar como voluntário.\n`;
                isValid = false;
            }
        }

        // 4. Validação de CPF (Formato. O formato completo é validado pelo atributo pattern no HTML)
        const cpfInput = document.getElementById('cpf');
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (cpfInput && cpfInput.value.trim() && !cpfRegex.test(cpfInput.value)) {
             errorMessage += `- CPF inválido. Utilize o formato: 000.000.000-00\n`;
             isValid = false;
        }

        // 5. Validação de Estado (UF - Máximo 2 caracteres)
        const estadoInput = document.getElementById('estado');
        if (estadoInput && estadoInput.value.trim() && estadoInput.value.length !== 2) {
             errorMessage += `- O campo Estado deve ter 2 caracteres (Ex: MG).\n`;
             isValid = false;
        }
        
        // Finalização da validação
        if (!isValid) {
            // Impede o envio do formulário
            event.preventDefault(); 
            // Exibe a mensagem de erro para o usuário
            alert(errorMessage);
        }
    });
}