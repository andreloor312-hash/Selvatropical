import { Link } from 'react-router-dom';
import { Container, Group, Button, Text, Badge, Box, ActionIcon, Tooltip } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import {
  IconLogout,
  IconShieldLock,
  IconShoppingBag,
  IconSparkles,
  IconTruckDelivery,
  IconUser,
} from '@tabler/icons-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import BrandLogo from './BrandLogo';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Navbar() {
  const { user, isAdmin, openAuthModal, logout } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const [{ y }] = useWindowScroll();
  const scrolled = y > 8;
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      {/* Barra de anuncio */}
      <Box
        style={{
          background: 'linear-gradient(90deg, #04231a 0%, #075239 55%, #087f5b 100%)',
          color: '#d8f5e6',
        }}
        py={7}
      >
        <Container size="xl">
          <Group justify="center" gap="lg" wrap="nowrap">
            <Group gap={6} wrap="nowrap" visibleFrom="sm">
              <IconSparkles size={14} color="#8ce99a" />
              <Text size="xs" fw={600}>
                Suplementos originales de laboratorios certificados
              </Text>
            </Group>
            <Group gap={6} wrap="nowrap">
              <IconTruckDelivery size={14} color="#8ce99a" />
              <Text size="xs" fw={600}>
                Pedidos y entregas coordinados por WhatsApp
              </Text>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Navbar */}
      <Box
        component="header"
        py={10}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(6, 51, 38, 0.1)' : 'transparent'}`,
          boxShadow: scrolled ? '0 12px 30px -20px rgba(6, 51, 38, 0.45)' : 'none',
          transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        <Container size="xl">
          <Group justify="space-between" gap="md">
            <Box component={Link} to="/" style={{ textDecoration: 'none' }} aria-label="Inicio">
              <BrandLogo />
            </Box>

            <Group gap="xl" visibleFrom="md">
              <button type="button" className="nav-link" onClick={() => scrollTo('catalogo')}>
                Catálogo
              </button>
              <button type="button" className="nav-link" onClick={() => scrollTo('beneficios')}>
                Beneficios
              </button>
              <button type="button" className="nav-link" onClick={() => scrollTo('como-comprar')}>
                Cómo comprar
              </button>
            </Group>

            <Group gap="sm">
              {isAdmin && (
                <Badge
                  color="teal"
                  variant="light"
                  leftSection={<IconShieldLock size={12} />}
                  visibleFrom="md"
                >
                  Admin
                </Badge>
              )}

              <Tooltip label="Mi pedido" withArrow>
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="light"
                  color="teal"
                  onClick={() => scrollTo('carrito')}
                  aria-label="Ir a mi pedido"
                  pos="relative"
                >
                  <IconShoppingBag size={18} />
                  {totalItems > 0 && (
                    <Badge
                      size="xs"
                      circle
                      color="teal"
                      variant="filled"
                      pos="absolute"
                      top={-6}
                      right={-6}
                      style={{ pointerEvents: 'none' }}
                    >
                      {totalItems}
                    </Badge>
                  )}
                </ActionIcon>
              </Tooltip>

              {user ? (
                <Group gap="xs" wrap="nowrap">
                  <Group gap={6} wrap="nowrap" visibleFrom="sm">
                    <IconUser size={15} color="#087f5b" />
                    <Text size="sm" fw={600} maw={150} truncate>
                      {user.displayName || user.email}
                    </Text>
                  </Group>
                  <Tooltip label="Cerrar sesión" withArrow>
                    <ActionIcon
                      size="lg"
                      radius="xl"
                      variant="light"
                      color="red"
                      onClick={logout}
                      aria-label="Cerrar sesión"
                    >
                      <IconLogout size={17} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ) : (
                <Button
                  size="sm"
                  color="teal"
                  variant="gradient"
                  gradient={{ from: 'teal.7', to: 'green.6', deg: 120 }}
                  onClick={openAuthModal}
                >
                  Iniciar sesión
                </Button>
              )}
            </Group>
          </Group>
        </Container>
      </Box>
    </>
  );
}
