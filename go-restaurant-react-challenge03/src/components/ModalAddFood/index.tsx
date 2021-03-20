import React, { useRef, useCallback } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import { FoodType } from '../Food';

interface ModalAddFoodProps {
  setIsOpen: () => void;
  handleAddFood: (data: FoodType) => void;
  isOpen: boolean;
}

const ModalAddFood: React.FC<ModalAddFoodProps> = ({ setIsOpen, handleAddFood, isOpen }) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback((data) => {
    handleAddFood(data);
    setIsOpen()
  }, [handleAddFood, setIsOpen])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}

export default ModalAddFood;