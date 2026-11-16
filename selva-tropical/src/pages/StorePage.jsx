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
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconShoppingCart,
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
} from '@tabler/icons-react';
import { useAuthStore } from '../store/useAuthStore';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import ProductFormModal, { LABORATORIES, CATEGORIES } from '../components/ProductFormModal';

const WHATSAPP_NUMBER = '593999999999';

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
    <Box bg="gray.0" mih="100vh" pb="xl">
      {/* Banner Principal */}
      <Paper
        radius={0}
        py={44}
        mb="xl"
        style={{
          background: 'linear-gradient(135deg, #087f5b 0%, #2b8a3e 100%)',
          color: 'white',
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Box maw={620}>
              <Badge color="lime" c="dark" variant="filled" mb="sm" leftSection={<IconSparkles size={12} />}>
                Medicina Natural y Suplementos
              </Badge>
              <Title order={1} mb="xs">
                Selva Tropical — Catálogo Oficial
              </Title>
              <Text c="teal.0">
                Explora suplementos y productos naturales por laboratorio o categoría con stock actualizado en tiempo real.
              </Text>
            </Box>

            {isAdmin && (
              <Button
                size="md"
                variant="white"
                color="teal"
                leftSection={<IconPlus size={18} />}
                onClick={handleOpenCreate}
              >
                Agregar Producto
              </Button>
            )}
          </Group>
        </Container>
      </Paper>

      <Container size="xl">
        {/* Barra de Filtros: Laboratorio + Categoría + Búsqueda */}
        <Paper p="md" radius="md" withBorder mb="xl">
          <Grid align="flex-end">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Laboratorio"
                leftSection={<IconFlask size={16} />}
                data={['Todos', ...LABORATORIES]}
                value={labFilter}
                onChange={(val) => setLabFilter(val || 'Todos')}
                searchable
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Select
                label="Categoría"
                leftSection={<IconCategory size={16} />}
                data={['Todas', ...CATEGORIES]}
                value={categoryFilter}
                onChange={(val) => setCategoryFilter(val || 'Todas')}
                searchable
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <TextInput
                label="Buscar producto"
                placeholder="Ej. Vitamina D3, Colágeno..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        <Grid gutter="xl">
          {/* Catálogo */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {loading ? (
              <Center py={60}>
                <Loader color="teal" />
              </Center>
            ) : visibleProducts.length === 0 ? (
              <Paper p="xl" radius="md" withBorder ta="center">
                <Text fw={600} mb="xs">
                  No hay productos que coincidan con los filtros seleccionados
                </Text>
                <Button
                  mt="xs"
                  variant="light"
                  color="teal"
                  onClick={() => {
                    setLabFilter('Todos');
                    setCategoryFilter('Todas');
                    setSearch('');
                  }}
                >
                  Limpiar filtros
                </Button>
              </Paper>
            ) : (
              <Grid>
                {visibleProducts.map((product) => {
                  const inCartQty = cart.find((c) => c.id === product.id)?.qty || 0;
                  const sinStockDisponible = product.stock <= 0 || inCartQty >= product.stock;

                  return (
                    <Grid.Col key={product.id} span={{ base: 12, sm: 6 }}>
                      <Card shadow="sm" padding="lg" radius="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
                        <Card.Section>
                          <Box pos="relative">
                            <Image src={product.image} height={180} alt={product.name} />
                            <Badge
                              color="teal"
                              variant="filled"
                              style={{ position: 'absolute', top: 12, left: 12 }}
                            >
                              {product.laboratory}
                            </Badge>
                            {product.category && (
                              <Badge
                                color="dark"
                                variant="filled"
                                style={{ position: 'absolute', bottom: 10, left: 12, opacity: 0.88 }}
                              >
                                {product.category}
                              </Badge>
                            )}
                            {!product.active && (
                              <Badge
                                color="red"
                                variant="filled"
                                style={{ position: 'absolute', top: 12, right: 12 }}
                              >
                                Oculto
                              </Badge>
                            )}
                          </Box>
                        </Card.Section>

                        <Stack justify="space-between" mt="md" style={{ flex: 1 }}>
                          <div>
                            <Text fw={700} size="lg">
                              {product.name}
                            </Text>
                            <Text size="xs" c={product.stock > 0 ? 'dimmed' : 'red'} fw={500} mb="xs">
                              {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Sin stock'}
                            </Text>
                            <Text size="sm" c="dimmed" lineClamp={2}>
                              {product.description}
                            </Text>
                          </div>

                          <div>
                            <Divider my="sm" />
                            <Group justify="space-between" mb="xs">
                              <Text fw={800} size="xl" c="teal">
                                ${Number(product.price).toFixed(2)}
                              </Text>

                              <Group gap="xs">
                                <Button
                                  size="xs"
                                  variant="default"
                                  leftSection={<IconEye size={14} />}
                                  onClick={() => handleOpenDetail(product)}
                                >
                                  Detalle
                                </Button>

                                {user ? (
                                  <Button
                                    size="xs"
                                    color="teal"
                                    disabled={sinStockDisponible}
                                    leftSection={<IconShoppingCart size={14} />}
                                    onClick={() => addToCart(product, 1)}
                                  >
                                    {product.stock <= 0 ? 'Agotado' : 'Añadir'}
                                  </Button>
                                ) : (
                                  <Button
                                    size="xs"
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

                            {/* Controles exclusivos del Administrador */}
                            {isAdmin && (
                              <Group grow gap="xs" mt="xs">
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="blue"
                                  leftSection={<IconEdit size={14} />}
                                  onClick={() => handleOpenEdit(product)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="red"
                                  leftSection={<IconTrash size={14} />}
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  Eliminar
                                </Button>
                              </Group>
                            )}
                          </div>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  );
                })}
              </Grid>
            )}
          </Grid.Col>

          {/* Carrito lateral */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card shadow="md" padding="lg" radius="md" withBorder pos="sticky" top={80}>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconShoppingCart size={20} color="#099268" />
                  <Text fw={700}>Mi Pedido</Text>
                </Group>
                {user && cart.length > 0 && (
                  <Badge color="teal" variant="light">
                    {cart.reduce((acc, i) => acc + i.qty, 0)} items
                  </Badge>
                )}
              </Group>

              {!user ? (
                <Stack align="center" ta="center" py="md" gap="sm">
                  <IconLock size={32} color="#099268" />
                  <Text size="sm" fw={600}>
                    Inicia sesión para realizar pedidos
                  </Text>
                  <Text size="xs" c="dimmed">
                    Los visitantes pueden consultar precios y detalles del catálogo. Inicia sesión o regístrate para añadir productos y pedir por WhatsApp.
                  </Text>
                  <Button fullWidth color="teal" mt="xs" onClick={openAuthModal}>
                    Iniciar sesión / Registrarse
                  </Button>
                </Stack>
              ) : (
                <>
                  {orderError && (
                    <Alert icon={<IconAlertCircle size={16} />} color="red" mb="sm" p="xs">
                      <Text size="xs">{orderError}</Text>
                    </Alert>
                  )}

                  {cart.length === 0 ? (
                    <Text size="sm" c="dimmed" ta="center" py="lg">
                      Tu carrito está vacío. Selecciona productos del catálogo.
                    </Text>
                  ) : (
                    <Stack gap="xs">
                      {cart.map((item) => (
                        <Paper key={item.id} p="xs" withBorder bg="gray.0">
                          <Group justify="space-between" wrap="nowrap">
                            <div>
                              <Text size="sm" fw={600}>
                                {item.name} (x{item.qty})
                              </Text>
                              <Text size="xs" c="dimmed">
                                {item.laboratory}
                              </Text>
                              <Text size="xs" c="teal" fw={600}>
                                ${(item.price * item.qty).toFixed(2)} USD
                              </Text>
                            </div>
                            <ActionIcon color="red" variant="subtle" onClick={() => removeFromCart(item.id)}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>
                        </Paper>
                      ))}

                      <Divider my="xs" />

                      <Group justify="space-between">
                        <Text fw={700}>Total a pagar:</Text>
                        <Text fw={800} size="xl" c="teal">
                          ${totalCart.toFixed(2)} USD
                        </Text>
                      </Group>

                      <Alert icon={<IconInfoCircle size={16} />} color="teal" variant="light" p="xs" mt="xs">
                        <Text size="xs">
                          <b>Método de pago:</b> Directo por WhatsApp (transferencia bancaria o contra entrega al confirmar tu chat).
                        </Text>
                      </Alert>

                      <Button
                        fullWidth
                        color="green"
                        mt="xs"
                        loading={processingOrder}
                        leftSection={<IconBrandWhatsapp size={18} />}
                        onClick={handleCheckoutWhatsApp}
                      >
                        Pagar y pedir por WhatsApp
                      </Button>
                    </Stack>
                  )}
                </>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Modal de Ver Detalle del Producto */}
      <Modal
        opened={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        title={
          <Group gap="xs">
            <Text fw={700} size="lg">
              {detailProduct?.name}
            </Text>
          </Group>
        }
        size="md"
        centered
      >
        {detailProduct && (
          <Stack>
            <Image src={detailProduct.image} height={220} radius="md" alt={detailProduct.name} />

            <Group gap="xs">
              <Badge color="teal" variant="filled">
                {detailProduct.laboratory}
              </Badge>
              {detailProduct.category && (
                <Badge color="gray" variant="light">
                  {detailProduct.category}
                </Badge>
              )}
              <Badge
                color={detailProduct.stock > 0 ? 'green' : 'red'}
                variant="outline"
                leftSection={<IconPackage size={12} />}
              >
                {detailProduct.stock > 0 ? `${detailProduct.stock} en stock` : 'Agotado'}
              </Badge>
            </Group>

            <Divider label="Descripción y beneficios" labelPosition="left" />

            <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
              {detailProduct.description}
            </Text>

            <Divider />

            <Group justify="space-between" align="flex-end">
              <div>
                <Text size="xs" c="dimmed">
                  Precio unitario
                </Text>
                <Text fw={800} size="xl" c="teal">
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
                  w={100}
                />
              )}
            </Group>

            {user ? (
              <Button
                fullWidth
                color="teal"
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