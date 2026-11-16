import { useState } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Stack,
  Switch,
  Group,
  ThemeIcon,
  Text,
  Box,
} from '@mantine/core';
import { IconPackage } from '@tabler/icons-react';
import { useProductStore } from '../store/useProductStore';
import { LABORATORIES, CATEGORIES } from '../config/catalog';

function ProductForm({ productToEdit, onClose }) {
  const { addProduct, updateProduct } = useProductStore();

  const [name, setName] = useState(productToEdit?.name || '');
  const [laboratory, setLaboratory] = useState(productToEdit?.laboratory || LABORATORIES[0]);
  const [category, setCategory] = useState(productToEdit?.category || CATEGORIES[0]);
  const [price, setPrice] = useState(productToEdit?.price ?? 0);
  const [stock, setStock] = useState(productToEdit?.stock ?? 10);
  const [image, setImage] = useState(productToEdit?.image || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [active, setActive] = useState(productToEdit?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        laboratory,
        category,
        price,
        stock,
        image:
          image.trim() ||
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        description: description.trim(),
        active,
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, payload);
      } else {
        await addProduct(payload);
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Nombre del producto"
          placeholder="Ej. Colágeno Hidrolizado + Vitamina C"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Group grow>
          <Select
            label="Laboratorio"
            placeholder="Selecciona laboratorio"
            data={LABORATORIES}
            value={laboratory}
            onChange={setLaboratory}
            searchable
            required
          />

          <Select
            label="Categoría"
            placeholder="Selecciona categoría"
            data={CATEGORIES}
            value={category}
            onChange={setCategory}
            searchable
            required
          />
        </Group>

        <Group grow>
          <NumberInput
            label="Precio (USD)"
            min={0}
            decimalScale={2}
            prefix="$"
            value={price}
            onChange={setPrice}
            required
          />

          <NumberInput
            label="Stock disponible"
            min={0}
            allowDecimal={false}
            value={stock}
            onChange={setStock}
            required
          />
        </Group>

        <TextInput
          label="URL de imagen"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Textarea
          label="Descripción y modo de uso"
          placeholder="Presentación, beneficios y posología..."
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Switch
          label="Producto visible en tienda"
          checked={active}
          onChange={(e) => setActive(e.currentTarget.checked)}
          color="teal"
        />

        <Button
          type="submit"
          color="teal"
          variant="gradient"
          gradient={{ from: 'teal.7', to: 'green.5', deg: 120 }}
          loading={saving}
          fullWidth
          size="md"
          mt="xs"
        >
          {productToEdit ? 'Guardar cambios' : 'Publicar producto'}
        </Button>
      </Stack>
    </form>
  );
}

export default function ProductFormModal({ opened, onClose, productToEdit }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon size={38} radius="lg" variant="light" color="teal">
            <IconPackage size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={800} size="md" lh={1.2}>
              {productToEdit ? 'Editar producto' : 'Nuevo producto'}
            </Text>
            <Text size="xs" c="dimmed" fw={500}>
              Selva Tropical · Catálogo
            </Text>
          </Box>
        </Group>
      }
      size="md"
      centered
      radius="xl"
    >
      <ProductForm
        key={productToEdit?.id || 'new'}
        productToEdit={productToEdit}
        onClose={onClose}
      />
    </Modal>
  );
}
