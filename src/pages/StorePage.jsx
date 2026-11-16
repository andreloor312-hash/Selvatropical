import { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Image,
  Text,
  Button,
  Badge,
  Group,
  Stack,
  Title,
  Divider,
  ActionIcon,
  Paper,
  Select,
  TextInput,
  Box,
  Loader,
  Center,
  Alert,
  Modal,
  NumberInput,
  Progress,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Tooltip,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconShoppingCart,
  IconShoppingBag,
  IconSearch,
  IconSparkles,
  IconFlask,
  IconCategory,
  IconBrandWhatsapp,
  IconInfoCircle,
  IconEye,
  IconPackage,
  IconAlertCircle,
  IconLock,
  IconShieldCheck,
  IconTruckDelivery,
  IconMessageCircle,
  IconLeaf,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconMail,
  IconPlant2,
  IconStar,
  IconUserCheck,
} from '@tabler/icons-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import ProductFormModal from '../components/ProductFormModal';
import { LABORATORIES, CATEGORIES } from '../config/catalog';
import Reveal from '../components/Reveal';
import heroImg from '../assets/hero.png';

const WHATSAPP_NUMBER = '593980892245';
const WHATSAPP_GREETING = encodeURIComponent(
  'Hola *Selva Tropical*, quisiera información sobre sus productos naturales.'
);

const CONTACT_EMAIL = 'todoesnatural1.2@gmail.com';
const EMAIL_SUBJECT = 'Hola Selva Tropical';
const EMAIL_BODY = 'Hola Selva Tropical,\n\nQuisiera información sobre sus productos naturales.';
const GMAIL_COMPOSE_URL = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(
  EMAIL_SUBJECT
)}&body=${encodeURIComponent(EMAIL_BODY)}`;

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function StorePage() {
  const { user, isAdmin, openAuthModal } = useAuthStore();
  const { products, loading, deleteProduct, decrementStockAfterOrder } = useProductStore();
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();

  const [labFilter, setLabFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [search, setSearch] = useState('');

  // Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);

  // Estados de checkout
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  const visibleProducts = products.filter((p) => {
    if (!isAdmin && p.active === false) return false;
    const matchLab = labFilter === 'Todos' || p.laboratory === labFilter;
    const matchCat = categoryFilter === 'Todas' || p.category === categoryFilter;
    const matchText = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchLab && matchCat && matchText;
  });

  const totalCart = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const hasFilters = labFilter !== 'Todos' || categoryFilter !== 'Todas' || search !== '';

  const clearFilters = () => {
    setLabFilter('Todos');
    setCategoryFilter('Todas');
    setSearch('');
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleOpenDetail = (product) => {
    setDetailProduct(product);
    setDetailQty(1);
  };

  const handleCheckoutWhatsApp = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (cart.length === 0) return;

    setOrderError('');
    setProcessingOrder(true);

    try {
      // 1. Descontar stock automáticamente en Firestore
      await decrementStockAfterOrder(cart);

      // 2. Construir mensaje y redirigir a WhatsApp
      const cliente = user.displayName || user.email;

      const listaProductos = cart
        .map(
          (item) =>
            `• *${item.name}* (${item.laboratory}) x${item.qty} — $${(
              item.price * item.qty
            ).toFixed(2)} USD`
        )
        .join('\n');

      const mensaje = [
        `Hola *Selva Tropical*, quisiera realizar el siguiente pedido:`,
        ``,
        `*Cliente:* ${cliente}`,
        `*Correo:* ${user.email}`,
        `*Detalle del pedido:*`,
        listaProductos,
        ``,
        `*Total a pagar:* $${totalCart.toFixed(2)} USD`,
        `*Método de pago:* Pago directo por WhatsApp (Transferencia / Contra entrega)`,
        ``,
        `Quedo atento para coordinar el pago y la entrega.`,
      ].join('\n');

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      clearCart();
    } catch (err) {
      setOrderError(err.message || 'No se pudo procesar el stock del pedido.');
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <Box bg="#f6f8f3" mih="100vh" pb="xl">
      {/* ======================= HERO ======================= */}
      <Box className="hero-section" pt={{ base: 48, md: 72 }} pb={{ base: 96, md: 128 }}>
        <Container size="xl" pos="relative" style={{ zIndex: 1 }}>
          <Grid gutter={{ base: 40, md: 60 }} align="center">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Badge
                className="hero-badge animate-in"
                size="lg"
                radius="xl"
                leftSection={<span className="hero-dot" />}
              >
                Medicina natural y suplementos
              </Badge>

              <Title className="hero-title animate-in" order={1} mt="md" mb="md" style={{ animationDelay: '90ms' }}>
                Bienestar natural,
                <br />
                <Text span className="hero-gradient-text" inherit>
                  directo a tu hogar
                </Text>
              </Title>

              <Text
                className="animate-in"
                c="rgba(216,245,230,0.86)"
                size="lg"
                maw={560}
                style={{ animationDelay: '180ms', lineHeight: 1.65 }}
              >
                Explora suplementos y productos naturales por laboratorio o categoría.
                Stock actualizado en tiempo real y pedidos coordinados por WhatsApp.
              </Text>

              <Group mt="xl" gap="sm" className="animate-in" style={{ animationDelay: '270ms' }}>
                <Button
                  size="lg"
                  radius="xl"
                  color="lime"
                  c="dark.9"
                  rightSection={<IconArrowRight size={18} />}
                  onClick={() => scrollTo('catalogo')}
                >
                  Ver catálogo
                </Button>

                <Button
                  size="lg"
                  radius="xl"
                  variant="outline"
                  color="lime"
                  leftSection={<IconBrandWhatsapp size={18} />}
                  component="a"
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GREETING}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  styles={{
                    root: {
                      borderColor: 'rgba(216,245,230,0.45)',
                      color: '#e6fcf5',
                      backdropFilter: 'blur(6px)',
                    },
                  }}
                >
                  Pedir por WhatsApp
                </Button>

                {isAdmin && (
                  <Button
                    size="lg"
                    radius="xl"
                    variant="white"
                    color="teal"
                    leftSection={<IconPlus size={18} />}
                    onClick={handleOpenCreate}
                  >
                    Agregar producto
                  </Button>
                )}
              </Group>

              <Group mt={40} gap={{ base: 24, sm: 40 }} className="animate-in" style={{ animationDelay: '360ms' }}>
                {[
                  { value: LABORATORIES.length, label: 'Laboratorios' },
                  { value: CATEGORIES.length, label: 'Categorías' },
                  { value: products.length, label: 'Productos' },
                ].map((stat) => (
                  <Box key={stat.label}>
                    <Text fw={800} size="1.7rem" c="white" lh={1.1}>
                      {stat.value}+
                    </Text>
                    <Text size="xs" fw={600} tt="uppercase" c="rgba(216,245,230,0.65)" style={{ letterSpacing: '1.4px' }}>
                      {stat.label}
                    </Text>
                  </Box>
                ))}
              </Group>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }} visibleFrom="md">
              <Box className="hero-visual animate-scale" style={{ animationDelay: '260ms' }}>
                <Image src={heroImg} alt="Productos naturales Selva Tropical" h={370} w="auto" fit="contain" className="float" />

                <Box className="hero-glass float-soft" top={16} right={0}>
                  <Box className="hero-glass-icon">
                    <IconPackage size={17} />
                  </Box>
                  <Box>
                    <Text size="10px" opacity={0.7} tt="uppercase" fw={700} style={{ letterSpacing: '1px' }}>
                      Inventario
                    </Text>
                    <Text size="xs" fw={800}>
                      Stock en vivo
                    </Text>
                  </Box>
                </Box>

                <Box className="hero-glass float" bottom={24} left={-6} style={{ animationDelay: '1.2s' }}>
                  <Box className="hero-glass-icon">
                    <IconLeaf size={17} />
                  </Box>
                  <Box>
                    <Text size="10px" opacity={0.7} tt="uppercase" fw={700} style={{ letterSpacing: '1px' }}>
                      Calidad
                    </Text>
                    <Text size="xs" fw={800}>
                      100% Natural
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* ==================== BENEFICIOS ==================== */}
      <Box id="beneficios" style={{ marginTop: -56 }}>
        <Container size="xl">
          <Reveal>
            <Paper
              radius="xl"
              p={{ base: 'lg', md: 'xl' }}
              style={{
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(6,51,38,0.08)',
                boxShadow: '0 24px 50px -28px rgba(6,51,38,0.45)',
              }}
            >
              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                {[
                  {
                    icon: IconShieldCheck,
                    title: 'Productos originales',
                    text: 'Trabajamos con laboratorios certificados y marcas reconocidas.',
                  },
                  {
                    icon: IconTruckDelivery,
                    title: 'Entrega coordinada',
                    text: 'Confirmamos pago y envío directamente por WhatsApp contigo.',
                  },
                  {
                    icon: IconMessageCircle,
                    title: 'Asesoría personalizada',
                    text: 'Te ayudamos a elegir el suplemento ideal para tu objetivo.',
                  },
                ].map((item) => (
                  <Group key={item.title} gap="md" wrap="nowrap" align="flex-start">
                    <ThemeIcon size={46} radius="lg" variant="light" color="teal">
                      <item.icon size={23} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={800} size="sm">
                        {item.title}
                      </Text>
                      <Text size="xs" c="dimmed" mt={3} style={{ lineHeight: 1.55 }}>
                        {item.text}
                      </Text>
                    </Box>
                  </Group>
                ))}
              </SimpleGrid>
            </Paper>
          </Reveal>

          {/* Marquee de laboratorios */}
          <Box mt="xl" py="xs" className="marquee">
            <Box className="marquee-track">
              {[...LABORATORIES, ...LABORATORIES].map((lab, index) => (
                <Box key={`${lab}-${index}`} className="marquee-item">
                  <IconPlant2 size={15} color="#12a97a" />
                  {lab}
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ===================== CATÁLOGO ===================== */}
      <Container size="xl" id="catalogo" mt={{ base: 44, md: 60 }}>
        <Reveal>
          <Group justify="space-between" align="flex-end" mb="lg">
            <Box>
              <Text
                size="xs"
                fw={800}
                c="teal.7"
                tt="uppercase"
                style={{ letterSpacing: '2.4px' }}
              >
                Catálogo
              </Text>
              <Title order={2} size="h1" mt={6}>
                Encuentra tu bienestar
              </Title>
              <Text c="dimmed" size="sm" mt={4}>
                Filtra por laboratorio, categoría o busca por nombre.
              </Text>
            </Box>
            <Badge size="lg" radius="xl" variant="light" color="teal">
              {visibleProducts.length} {visibleProducts.length === 1 ? 'producto' : 'productos'}
            </Badge>
          </Group>
        </Reveal>

        {/* Filtros */}
        <Reveal delay={60}>
          <Paper
            p={{ base: 'md', md: 'lg' }}
            radius="xl"
            mb="lg"
            style={{
              background: '#fff',
              border: '1px solid rgba(6,51,38,0.08)',
              boxShadow: '0 18px 40px -30px rgba(6,51,38,0.4)',
            }}
          >
            <Grid align="flex-end" gutter="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <TextInput
                  label="Buscar producto"
                  placeholder="Ej. Vitamina D3, Colágeno..."
                  leftSection={<IconSearch size={16} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  radius="xl"
                  size="md"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="Laboratorio"
                  leftSection={<IconFlask size={16} />}
                  data={['Todos', ...LABORATORIES]}
                  value={labFilter}
                  onChange={(val) => setLabFilter(val || 'Todos')}
                  searchable
                  radius="xl"
                  size="md"
                  checkIconPosition="right"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                <Select
                  label="Categoría"
                  leftSection={<IconCategory size={16} />}
                  data={['Todas', ...CATEGORIES]}
                  value={categoryFilter}
                  onChange={(val) => setCategoryFilter(val || 'Todas')}
                  searchable
                  radius="xl"
                  size="md"
                  checkIconPosition="right"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="light"
                  color="gray"
                  radius="xl"
                  size="md"
                  disabled={!hasFilters}
                  onClick={clearFilters}
                >
                  Limpiar
                </Button>
              </Grid.Col>
            </Grid>

            {/* Chips de categoría */}
            <Group gap="xs" mt="md" wrap="wrap">
              <button
                type="button"
                className="filter-chip"
                data-active={categoryFilter === 'Todas'}
                onClick={() => setCategoryFilter('Todas')}
              >
                Todas
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="filter-chip"
                  data-active={categoryFilter === cat}
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </Group>
          </Paper>
        </Reveal>

        <Grid gutter={{ base: 'lg', md: 'xl' }}>
          {/* Catálogo */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {loading ? (
              <Center py={80}>
                <Stack align="center" gap="sm">
                  <Loader color="teal" size="lg" type="dots" />
                  <Text size="sm" c="dimmed">
                    Cargando catálogo...
                  </Text>
                </Stack>
              </Center>
            ) : visibleProducts.length === 0 ? (
              <Reveal>
                <Paper p="xl" radius="xl" withBorder ta="center" bg="white">
                  <ThemeIcon size={64} radius="xl" variant="light" color="teal" mx="auto">
                    <IconSearch size={30} />
                  </ThemeIcon>
                  <Text fw={800} size="lg" mt="md">
                    No encontramos productos con esos filtros
                  </Text>
                  <Text size="sm" c="dimmed" mt={4} mb="md">
                    Prueba con otro laboratorio, categoría o término de búsqueda.
                  </Text>
                  <Button variant="light" color="teal" radius="xl" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                </Paper>
              </Reveal>
            ) : (
              <Grid gutter="lg">
                {visibleProducts.map((product, index) => {
                  const inCartQty = cart.find((c) => c.id === product.id)?.qty || 0;
                  const sinStockDisponible = product.stock <= 0 || inCartQty >= product.stock;
                  const stockPercent = Math.min(
                    100,
                    Math.max(0, (Number(product.stock || 0) / 30) * 100)
                  );
                  const stockColor =
                    product.stock <= 0 ? 'red' : product.stock <= 5 ? 'orange' : 'teal';

                  return (
                    <Grid.Col key={product.id} span={{ base: 12, sm: 6 }}>
                      <Reveal delay={(index % 6) * 70} style={{ height: '100%' }}>
                        <Card
                          className="product-card"
                          shadow="sm"
                          padding={0}
                          radius="xl"
                          withBorder
                          h="100%"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#fff',
                          }}
                        >
                          <Card.Section>
                            <Box className="product-media" h={190} pos="relative">
                              <Image src={product.image} h={190} alt={product.name} fit="cover" />

                              <Badge
                                color="dark"
                                variant="filled"
                                size="sm"
                                style={{
                                  position: 'absolute',
                                  top: 12,
                                  left: 12,
                                  background: 'rgba(4,35,26,0.72)',
                                  backdropFilter: 'blur(6px)',
                                }}
                              >
                                {product.laboratory}
                              </Badge>

                              {!product.active && (
                                <Badge
                                  color="red"
                                  variant="filled"
                                  size="sm"
                                  style={{ position: 'absolute', top: 12, right: 12 }}
                                >
                                  Oculto
                                </Badge>
                              )}

                              {product.stock > 0 && product.stock <= 5 && (
                                <Badge
                                  color="orange"
                                  variant="filled"
                                  size="sm"
                                  leftSection={<IconAlertCircle size={11} />}
                                  style={{ position: 'absolute', bottom: 12, right: 12 }}
                                >
                                  Últimas {product.stock}
                                </Badge>
                              )}
                            </Box>
                          </Card.Section>

                          <Stack justify="space-between" p="md" gap="sm" style={{ flex: 1 }}>
                            <Box>
                              <Group gap={6} mb={4}>
                                <IconFlask size={13} color="#12a97a" />
                                <Text size="10px" fw={800} c="teal.7" tt="uppercase" style={{ letterSpacing: '1.2px' }}>
                                  {product.category || 'Natural'}
                                </Text>
                              </Group>

                              <Text fw={800} size="md" lineClamp={2} style={{ lineHeight: 1.3, minHeight: 42 }}>
                                {product.name}
                              </Text>

                              <Text size="xs" c="dimmed" mt={6} lineClamp={2} style={{ lineHeight: 1.55 }}>
                                {product.description}
                              </Text>

                              <Box mt="sm">
                                <Group justify="space-between" mb={5}>
                                  <Text size="10px" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.8px' }}>
                                    Disponibilidad
                                  </Text>
                                  <Text size="10px" fw={800} c={product.stock > 0 ? 'dimmed' : 'red'}>
                                    {product.stock > 0 ? `${product.stock} und.` : 'Sin stock'}
                                  </Text>
                                </Group>
                                <Progress value={stockPercent} color={stockColor} size="xs" radius="xl" />
                              </Box>
                            </Box>

                            <Box>
                              <Group justify="space-between" align="flex-end" mt="xs">
                                <Box>
                                  <Text size="10px" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.8px' }}>
                                    Precio
                                  </Text>
                                  <Text fw={800} size="1.55rem" c="teal.7" lh={1.1}>
                                    ${Number(product.price).toFixed(2)}
                                    <Text span size="xs" fw={700} c="dimmed">
                                      {' '}USD
                                    </Text>
                                  </Text>
                                </Box>

                                <Group gap={6}>
                                  <Tooltip label="Ver detalle" withArrow>
                                    <ActionIcon
                                      size="lg"
                                      radius="xl"
                                      variant="light"
                                      color="gray"
                                      onClick={() => handleOpenDetail(product)}
                                      aria-label={`Ver detalle de ${product.name}`}
                                    >
                                      <IconEye size={17} />
                                    </ActionIcon>
                                  </Tooltip>

                                  {user ? (
                                    <Button
                                      size="sm"
                                      radius="xl"
                                      color="teal"
                                      variant="gradient"
                                      gradient={{ from: 'teal.7', to: 'green.5', deg: 120 }}
                                      disabled={sinStockDisponible}
                                      leftSection={<IconShoppingCart size={15} />}
                                      onClick={() => addToCart(product, 1)}
                                    >
                                      {product.stock <= 0 ? 'Agotado' : 'Añadir'}
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      radius="xl"
                                      variant="light"
                                      color="teal"
                                      leftSection={<IconLock size={14} />}
                                      onClick={openAuthModal}
                                    >
                                      Ingresar
                                    </Button>
                                  )}
                                </Group>
                              </Group>

                              {isAdmin && (
                                <Group grow gap="xs" mt="sm">
                                  <Button
                                    size="xs"
                                    radius="xl"
                                    variant="light"
                                    color="blue"
                                    leftSection={<IconEdit size={13} />}
                                    onClick={() => handleOpenEdit(product)}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                    size="xs"
                                    radius="xl"
                                    variant="light"
                                    color="red"
                                    leftSection={<IconTrash size={13} />}
                                    onClick={() => deleteProduct(product.id)}
                                  >
                                    Eliminar
                                  </Button>
                                </Group>
                              )}
                            </Box>
                          </Stack>
                        </Card>
                      </Reveal>
                    </Grid.Col>
                  );
                })}
              </Grid>
            )}
          </Grid.Col>

          {/* Carrito lateral */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Reveal delay={120} style={{ position: 'sticky', top: 96 }}>
              <Card
                id="carrito"
                padding={0}
                radius="xl"
                withBorder
                shadow="md"
                style={{ overflow: 'hidden', background: '#fff' }}
              >
                {/* Encabezado del carrito */}
                <Box
                  p="md"
                  style={{
                    background:
                      'radial-gradient(220px 120px at 90% 0%, rgba(18,169,122,0.4), transparent 70%), linear-gradient(135deg, #04231a, #075239)',
                    color: '#fff',
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="sm">
                      <Box
                        style={{
                          display: 'grid',
                          placeItems: 'center',
                          width: 42,
                          height: 42,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.18)',
                        }}
                      >
                        <IconShoppingBag size={21} color="#8ce99a" />
                      </Box>
                      <Box>
                        <Text fw={800} size="sm" lh={1.2}>
                          Mi pedido
                        </Text>
                        <Text size="10px" c="rgba(216,245,230,0.7)" fw={600}>
                          {totalItems > 0 ? `${totalItems} artículo(s)` : 'Listo para tu compra'}
                        </Text>
                      </Box>
                    </Group>
                    {totalItems > 0 && (
                      <Badge color="lime" c="dark.9" variant="filled" size="lg" radius="xl">
                        {totalItems}
                      </Badge>
                    )}
                  </Group>
                </Box>

                <Box p="md">
                  {!user ? (
                    <Stack align="center" ta="center" py="lg" gap="sm">
                      <ThemeIcon size={60} radius="xl" variant="light" color="teal">
                        <IconLock size={28} />
                      </ThemeIcon>
                      <Text size="sm" fw={800}>
                        Inicia sesión para realizar pedidos
                      </Text>
                      <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>
                        Los visitantes pueden consultar precios y detalles. Inicia sesión o
                        regístrate para añadir productos y pedir por WhatsApp.
                      </Text>
                      <Button
                        fullWidth
                        radius="xl"
                        color="teal"
                        variant="gradient"
                        gradient={{ from: 'teal.7', to: 'green.5', deg: 120 }}
                        mt="xs"
                        onClick={openAuthModal}
                      >
                        Iniciar sesión / Registrarse
                      </Button>
                    </Stack>
                  ) : (
                    <>
                      {orderError && (
                        <Alert
                          icon={<IconAlertCircle size={16} />}
                          color="red"
                          mb="sm"
                          p="xs"
                          radius="md"
                        >
                          <Text size="xs">{orderError}</Text>
                        </Alert>
                      )}

                      {cart.length === 0 ? (
                        <Stack align="center" ta="center" py="lg" gap="sm">
                          <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                            <IconShoppingCart size={28} />
                          </ThemeIcon>
                          <Text size="sm" fw={700}>
                            Tu carrito está vacío
                          </Text>
                          <Text size="xs" c="dimmed">
                            Selecciona productos del catálogo para comenzar tu pedido.
                          </Text>
                          <Button
                            variant="light"
                            color="teal"
                            radius="xl"
                            size="xs"
                            onClick={() => scrollTo('catalogo')}
                          >
                            Explorar catálogo
                          </Button>
                        </Stack>
                      ) : (
                        <Stack gap="xs">
                          {cart.map((item) => (
                            <Paper
                              key={item.id}
                              p="xs"
                              radius="md"
                              style={{ border: '1px solid #eef2e9', background: '#fbfcf9' }}
                            >
                              <Group justify="space-between" wrap="nowrap" gap="xs">
                                <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                                  <Image
                                    src={item.image}
                                    w={44}
                                    h={44}
                                    radius="md"
                                    fit="cover"
                                    alt={item.name}
                                  />
                                  <Box style={{ minWidth: 0 }}>
                                    <Text size="xs" fw={800} truncate>
                                      {item.name}
                                    </Text>
                                    <Text size="10px" c="dimmed">
                                      {item.laboratory} · x{item.qty}
                                    </Text>
                                    <Text size="xs" c="teal.7" fw={800}>
                                      ${(item.price * item.qty).toFixed(2)} USD
                                    </Text>
                                  </Box>
                                </Group>
                                <Tooltip label="Quitar" withArrow>
                                  <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    radius="xl"
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label={`Quitar ${item.name}`}
                                  >
                                    <IconTrash size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              </Group>
                            </Paper>
                          ))}

                          <Divider my="xs" />

                          <Box
                            p="sm"
                            radius="md"
                            style={{
                              background: 'linear-gradient(135deg, #e6f6ef, #f4fbf7)',
                              border: '1px solid #d0ecdf',
                            }}
                          >
                            <Group justify="space-between">
                              <Text fw={700} size="sm">
                                Total a pagar
                              </Text>
                              <Text fw={800} size="1.35rem" c="teal.7">
                                ${totalCart.toFixed(2)}
                                <Text span size="xs" c="dimmed" fw={700}>
                                  {' '}USD
                                </Text>
                              </Text>
                            </Group>
                          </Box>

                          <Alert
                            icon={<IconInfoCircle size={16} />}
                            color="teal"
                            variant="light"
                            radius="md"
                            p="xs"
                          >
                            <Text size="xs" style={{ lineHeight: 1.55 }}>
                              <b>Método de pago:</b> directo por WhatsApp (transferencia
                              bancaria o contra entrega al confirmar tu chat).
                            </Text>
                          </Alert>

                          <Button
                            fullWidth
                            radius="xl"
                            size="md"
                            color="green"
                            className="shine"
                            mt={4}
                            loading={processingOrder}
                            leftSection={<IconBrandWhatsapp size={19} />}
                            onClick={handleCheckoutWhatsApp}
                            style={{
                              background: 'linear-gradient(135deg, #25d366, #0f9d58)',
                            }}
                          >
                            Pagar y pedir por WhatsApp
                          </Button>

                          <Group justify="center" gap={5} mt={2}>
                            <IconShieldCheck size={13} color="#12a97a" />
                            <Text size="10px" c="dimmed" fw={600}>
                              Compra segura y confirmación personal
                            </Text>
                          </Group>
                        </Stack>
                      )}
                    </>
                  )}
                </Box>
              </Card>
            </Reveal>
          </Grid.Col>
        </Grid>
      </Container>

      {/* ================== CÓMO COMPRAR ================== */}
      <Container size="xl" id="como-comprar" mt={{ base: 60, md: 90 }}>
        <Reveal>
          <Box ta="center" mb="xl">
            <Text
              size="xs"
              fw={800}
              c="teal.7"
              tt="uppercase"
              style={{ letterSpacing: '2.4px' }}
            >
              Cómo comprar
            </Text>
            <Title order={2} mt={6}>
              Así de fácil es pedir
            </Title>
            <Text c="dimmed" size="sm" mt={4} maw={520} mx="auto">
              Tres pasos simples para recibir tus productos naturales donde estés.
            </Text>
          </Box>
        </Reveal>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {[
            {
              icon: IconSearch,
              step: '01',
              title: 'Elige tus productos',
              text: 'Explora el catálogo y filtra por laboratorio o categoría. Revisa el detalle y añade al pedido.',
            },
            {
              icon: IconUserCheck,
              step: '02',
              title: 'Inicia sesión',
              text: 'Crea tu cuenta o ingresa para guardar tu pedido y confirmar la disponibilidad real.',
            },
            {
              icon: IconBrandWhatsapp,
              step: '03',
              title: 'Confirma por WhatsApp',
              text: 'Envía tu pedido con un clic. Coordinamos pago, entrega y cualquier duda al instante.',
            },
          ].map((step, index) => (
            <Reveal key={step.step} delay={index * 100} style={{ height: '100%' }}>
              <Paper
                p="xl"
                radius="xl"
                h="100%"
                style={{
                  background: '#fff',
                  border: '1px solid rgba(6,51,38,0.08)',
                  boxShadow: '0 18px 40px -32px rgba(6,51,38,0.5)',
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <ThemeIcon size={52} radius="lg" variant="light" color="teal">
                    <step.icon size={25} />
                  </ThemeIcon>
                  <Text fw={800} size="1.9rem" c="teal.1">
                    {step.step}
                  </Text>
                </Group>
                <Text fw={800} size="md" mt="md">
                  {step.title}
                </Text>
                <Text size="sm" c="dimmed" mt={6} style={{ lineHeight: 1.65 }}>
                  {step.text}
                </Text>
              </Paper>
            </Reveal>
          ))}
        </SimpleGrid>

        <Reveal delay={120}>
          <Paper
            mt="xl"
            p={{ base: 'lg', md: 'xl' }}
            radius="xl"
            style={{
              background:
                'radial-gradient(500px 200px at 90% 0%, rgba(18,169,122,0.35), transparent 70%), linear-gradient(135deg, #04231a, #075239)',
              color: '#fff',
            }}
          >
            <Group justify="space-between" gap="lg">
              <Box>
                <Group gap="xs" mb={6}>
                  <IconSparkles size={16} color="#8ce99a" />
                  <Text size="xs" fw={800} tt="uppercase" c="#8ce99a" style={{ letterSpacing: '1.6px' }}>
                    Atención personalizada
                  </Text>
                </Group>
                <Title order={3} c="white">
                  ¿No sabes qué producto elegir?
                </Title>
                <Text size="sm" c="rgba(216,245,230,0.8)" mt={4}>
                  Escríbenos y te ayudamos a encontrar el suplemento ideal para ti.
                </Text>
              </Box>
              <Button
                size="lg"
                radius="xl"
                color="lime"
                c="dark.9"
                leftSection={<IconBrandWhatsapp size={19} />}
                component="a"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GREETING}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hablar con un asesor
              </Button>
            </Group>
          </Paper>
        </Reveal>
      </Container>

      {/* ===================== FOOTER ===================== */}
      <Box component="footer" className="site-footer" mt={{ base: 60, md: 90 }} pt={{ base: 48, md: 64 }} pb="lg">
        <Container size="xl">
          <Reveal>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
            <Box>
              <Group gap="sm" mb="sm">
                <Box
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    background: 'rgba(140,233,154,0.14)',
                    border: '1px solid rgba(140,233,154,0.3)',
                  }}
                >
                  <IconLeaf size={24} color="#8ce99a" />
                </Box>
                <Box>
                  <Text fw={800} c="white" size="md" lh={1.1}>
                    Selva Tropical
                  </Text>
                  <Text size="10px" fw={700} tt="uppercase" c="#8ce99a" style={{ letterSpacing: '1.6px' }}>
                    Medicina natural
                  </Text>
                </Box>
              </Group>
              <Text size="sm" c="rgba(207,228,218,0.75)" style={{ lineHeight: 1.7 }}>
                Suplementos y productos naturales seleccionados para acompañar tu
                bienestar, con atención cercana y stock real.
              </Text>
              <Group gap={6} mt="md">
                {[0, 1, 2, 3, 4].map((star) => (
                  <IconStar key={star} size={14} fill="#8ce99a" color="#8ce99a" />
                ))}
                <Text size="xs" c="rgba(207,228,218,0.7)" ml={4}>
                  Confianza natural
                </Text>
              </Group>
            </Box>

            <Box>
              <Text fw={800} c="white" size="sm" mb="sm">
                Contacto
              </Text>
              <Stack gap="xs">
                <Anchor
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GREETING}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  c="rgba(207,228,218,0.8)"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <IconBrandWhatsapp size={15} color="#8ce99a" /> +593 98 089 2245
                </Anchor>
                <Anchor
                  href={GMAIL_COMPOSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  c="rgba(207,228,218,0.8)"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <IconMail size={15} color="#8ce99a" /> {CONTACT_EMAIL}
                </Anchor>
                <Group gap={8} wrap="nowrap">
                  <IconClock size={15} color="#8ce99a" />
                  <Text size="sm" c="rgba(207,228,218,0.8)">
                    Lun — Sáb · 9:00 a 19:00
                  </Text>
                </Group>
              </Stack>
            </Box>

            <Box>
              <Text fw={800} c="white" size="sm" mb="sm">
                Compra
              </Text>
              <Stack gap="xs">
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => scrollTo('catalogo')}
                  c="rgba(207,228,218,0.8)"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <IconShoppingBag size={15} color="#8ce99a" /> Catálogo
                </Anchor>
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => scrollTo('como-comprar')}
                  c="rgba(207,228,218,0.8)"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <IconCheck size={15} color="#8ce99a" /> Cómo comprar
                </Anchor>
                <Anchor
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GREETING}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  c="rgba(207,228,218,0.8)"
                  size="sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <IconMessageCircle size={15} color="#8ce99a" /> Asesoría
                </Anchor>
              </Stack>
            </Box>

            <Box>
              <Text fw={800} c="white" size="sm" mb="sm">
                Métodos de pago
              </Text>
              <Text size="sm" c="rgba(207,228,218,0.75)" style={{ lineHeight: 1.7 }}>
                Transferencia bancaria o pago contra entrega, coordinado por WhatsApp
                al confirmar tu pedido.
              </Text>
              <Group gap="xs" mt="md">
                <Badge variant="light" color="lime" radius="sm">
                  Transferencia
                </Badge>
                <Badge variant="light" color="lime" radius="sm">
                  Contra entrega
                </Badge>
              </Group>
            </Box>
          </SimpleGrid>
          </Reveal>

          <Divider my="lg" color="rgba(255,255,255,0.1)" />

          <Group justify="space-between" gap="sm">
            <Text size="xs" c="rgba(207,228,218,0.6)">
              © {new Date().getFullYear()} Selva Tropical. Todos los derechos reservados.
            </Text>
            <Group gap={6}>
              <IconLeaf size={13} color="#8ce99a" />
              <Text size="xs" c="rgba(207,228,218,0.6)">
                Bienestar natural, todos los días.
              </Text>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* WhatsApp flotante */}
      <Anchor
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GREETING}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Escribir por WhatsApp"
      >
        <IconBrandWhatsapp size={28} />
      </Anchor>

      {/* ================= MODAL DETALLE ================= */}
      <Modal
        opened={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        title={
          <Group gap="xs">
            <ThemeIcon size={30} radius="md" variant="light" color="teal">
              <IconPackage size={17} />
            </ThemeIcon>
            <Text fw={800} size="lg">
              {detailProduct?.name}
            </Text>
          </Group>
        }
        size="md"
        centered
        radius="xl"
      >
        {detailProduct && (
          <Stack>
            <Image
              src={detailProduct.image}
              height={230}
              radius="lg"
              alt={detailProduct.name}
              fit="cover"
            />

            <Group gap="xs">
              <Badge color="teal" variant="filled" radius="sm">
                {detailProduct.laboratory}
              </Badge>
              {detailProduct.category && (
                <Badge color="gray" variant="light" radius="sm">
                  {detailProduct.category}
                </Badge>
              )}
              <Badge
                color={detailProduct.stock > 0 ? 'green' : 'red'}
                variant="outline"
                radius="sm"
                leftSection={<IconPackage size={12} />}
              >
                {detailProduct.stock > 0 ? `${detailProduct.stock} en stock` : 'Agotado'}
              </Badge>
            </Group>

            <Divider label="Descripción y beneficios" labelPosition="left" />

            <Text size="sm" style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {detailProduct.description}
            </Text>

            <Divider />

            <Group justify="space-between" align="flex-end">
              <div>
                <Text size="xs" c="dimmed">
                  Precio unitario
                </Text>
                <Text fw={800} size="xl" c="teal.7">
                  ${Number(detailProduct.price).toFixed(2)} USD
                </Text>
              </div>

              {user && detailProduct.stock > 0 && (
                <NumberInput
                  label="Cantidad"
                  min={1}
                  max={detailProduct.stock}
                  value={detailQty}
                  onChange={(val) => setDetailQty(Number(val) || 1)}
                  w={110}
                  radius="md"
                />
              )}
            </Group>

            {user ? (
              <Button
                fullWidth
                radius="xl"
                size="md"
                color="teal"
                variant="gradient"
                gradient={{ from: 'teal.7', to: 'green.5', deg: 120 }}
                disabled={detailProduct.stock <= 0}
                leftSection={<IconShoppingCart size={18} />}
                onClick={() => {
                  addToCart(detailProduct, detailQty);
                  setDetailProduct(null);
                }}
              >
                {detailProduct.stock > 0
                  ? `Agregar al pedido ($${(detailProduct.price * detailQty).toFixed(2)})`
                  : 'Producto agotado'}
              </Button>
            ) : (
              <Button
                fullWidth
                radius="xl"
                size="md"
                color="teal"
                variant="light"
                leftSection={<IconLock size={16} />}
                onClick={() => {
                  setDetailProduct(null);
                  openAuthModal();
                }}
              >
                Inicia sesión para comprar este producto
              </Button>
            )}
          </Stack>
        )}
      </Modal>

      {/* Modal Admin Crear / Editar */}
      <ProductFormModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        productToEdit={editingProduct}
      />
    </Box>
  );
}
