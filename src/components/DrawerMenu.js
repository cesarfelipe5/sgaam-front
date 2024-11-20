import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons'; // Importando os ícones
import logo from "../imagens/logo_academia.png";

const DrawerMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const navigate = useNavigate(); // Hook para navegação

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      closeMenu();
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    closeMenu(); // Fecha o menu
    navigate('/login'); // Redireciona para a tela de login
  };

  return (
    <header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FFD700', padding: '10px', height: '100px', zIndex: 1000, position: 'relative' }}>
      {/* Botão para abrir o menu com ícone */}
      <button 
        onClick={toggleMenu} 
        style={{ marginRight: '20px', backgroundColor: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#000' }}
      >
        <MenuOutlined style={{ marginRight: '10px', marginLeft: '15px', fontSize: '30px'}} /> {/* Ícone de menu burger preto */}
      </button>
      {/* Logo da Academia */}
      <img 
        src={logo} alt="Logo" style={{ height: '80px', marginRight: '10px', width: 90 }} 
      />
      <h1 style={{ marginLeft: '10px', color: '#000', fontSize: '20px' }}>
        SISTEMA DE GERENCIAMENTO DE ACADEMIA DE ARTES MARCIAIS
      </h1>

      {/* Menu lateral (Drawer) */}
      <nav 
        ref={drawerRef} 
        style={{ 
          display: isMenuOpen ? 'block' : 'none', 
          backgroundColor: '#000', 
          width: '250px', 
          height: '100%', 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 2000, // Garante que o menu esteja acima de todo o conteúdo
        }}
      >
        {/* Botão para fechar o menu com ícone branco */}
        <button 
          onClick={closeMenu} 
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '20px', 
            cursor: 'pointer', 
            padding: '10px', 
            color: '#fff' 
          }}
        >
          <MenuOutlined style={{ marginLeft: '20px', fontSize: 30}} /> {/* Ícone de menu burger branco */}
        </button>
        
        {/* Links do Menu */}
        <ul style={{ listStyleType: 'none', padding: '20px', color: '#fff' }}>
          <li><Link to="/main" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Home</Link></li>
          <li><Link to="/aulasexperimentais" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Aulas Experimentais</Link></li>
          <li><Link to="/mensalidades" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Mensalidades</Link></li>
          <li><Link to="/modalidades" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Modalidades</Link></li>
          <li><Link to="/pagamentos" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Pagamentos</Link></li>
          <li><Link to="/relatorios" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Relatórios</Link></li>
          <li><Link to="/userpermissoes" onClick={closeMenu} style={{ color: '#fff', textDecoration: 'none' }}>Usuários e permissões</Link></li>
          {/* Botão de Sair com ícone */}
          <li style={{ position: 'absolute', bottom: '20px' }}>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <LogoutOutlined /> Sair {/* Ícone de sair */}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default DrawerMenu;
