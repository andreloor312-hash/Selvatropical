import { Link } from 'react-router-dom';
import { Container, Group, Button, Text, Badge, Box } from '@mantine/core';
import { IconLogout, IconShieldLock } from '@tabler/icons-react';
import { useAuthStore } from '../store/useAuthStore';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { user, isAdmin, openAuthModal, logout } = useAuthStore();

  return (
    <Box
      component="header"
      py="sm"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #e9ecef',
      }}
    >
      <Container size="xl">
        <Group justify="space-between">
          <Box component={Link} to="/" style={{ textDecoration: 'none' }}>
            <BrandLogo />
          </Box>

          <Group gap="sm">
            {isAdmin && (
              <Badge color="teal" variant="filled" leftSection={<IconShieldLock size={12} />}>
                Modo Administrador
              </Badge>
            )}

            {user ? (
              <Group gap="xs">
                <Text size="sm" fw={500} visibleFrom="xs">
                  {user.displayName || user.email}
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  color="red"
                  leftSection={<IconLogout size={14} />}
                  onClick={logout}
                >
                  Salir
                </Button>
              </Group>
            ) : (
              <Button size="sm" color="teal" onClick={openAuthModal}>
                Iniciar Sesión
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}