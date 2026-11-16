import { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { useProductStore } from '../store/useProductStore';

export const LABORATORIES = [
  'LABMAC',
  'HERBALMAX',
  'NATURAL FACTORS',
  "NATURE'S PHARMA",
  "NATURE'S GARDEN",
  'OMNILIFE',
  'NUTRIFIT',
  'SUN VITAMINS',
];

export const CATEGORIES = [
  'Vitaminas y Minerales',
  'Colágeno y Articulaciones',
  'Sistema Inmune',
  'Digestión y Detox',
  'Energía y Rendimiento',
  'Control de Peso',
  'Cuidado Natural',
];

export default function ProductFormModal({ opened, onClose, productToEdit }) {
  const { addProduct, updateProduct } = useProductStore();

  const [name, setName] = useState('');
  const [laboratory, setLaboratory] = useState(LABORATORIES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(10);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setLaboratory(productToEdit.laboratory || LABORATORIES[0]);
      setCategory(productToEdit.category || CATEGORIES[0]);
      setPrice(productToEdit.price ?? 0);
      setStock(productToEdit.stock ?? 0);
      setImage(productToEdit.image || '');
      setDescription(productToEdit.description || '');
      setActive(productToEdit.active ?? true);
    } else {
      setName('');
      setLaboratory(LABORATORIES[0]);
      setCategory(CATEGORIES[0]);
      setPrice(0);
      setStock(10);
      setImage('');
      setDescription('');
      setActive(true);
    }
  }, [productToEdit, opened]);

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
    <Modal
      opened={opened}
      onClose={onClose}
      title={productToEdit ? 'Editar Producto' : 'Nuevo Producto — Selva Tropical'}
      size="md"
      centered
    >
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

          <Button type="submit" color="teal" loading={saving} fullWidth mt="xs">
            {productToEdit ? 'Guardar cambios' : 'Publicar producto'}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}