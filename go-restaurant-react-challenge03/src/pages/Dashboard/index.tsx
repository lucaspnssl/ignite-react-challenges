import { useCallback, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food, { FoodType } from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';


const Dashboard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodType>();

  useEffect(() => {
    api.get('/foods').then(response => setFoods(response.data))
  }, [])

  const toggleModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback(() => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen])

  const handleAddFood = useCallback((food: FoodType) => {
    api.post('/foods', {
      ...food,
      available: true
    })
      .then(response => setFoods([...foods, response.data]))
      .catch(error => console.log(error));
  }, [foods]);

  const handleEditFood = useCallback((food: FoodType) => {
    setEditingFood(food);
    setEditModalOpen(true);
  }, []);

  const handleUpdateFood = useCallback((food: FoodType) => {
    api.put(
      `/foods/${editingFood?.id}`,
      { ...editingFood, ...food },
    ).then(foodUpdated => {
      const foodsUpdated = foods.map<FoodType>(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    }).catch(error => console.log(error));

  }, [editingFood, foods])

  const handleDeleteFood = useCallback((id: number) => {
    api.delete(`/foods/${id}`)
      .then(() => {
        setFoods(foods.filter(food => food.id !== id))
      })
  }, [foods])

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;