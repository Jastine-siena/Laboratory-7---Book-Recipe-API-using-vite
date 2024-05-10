import React, { useEffect, useState } from "react";
import axios from 'axios';

const DataForm = () => {
  const API_URL = 'https://spectacular-flan-c1e4b3.netlify.app/.netlify/functions/api/';
  const [data, setData] = useState([]);
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleSubmit = (e, id = null) => {
    e.preventDefault();
    if (!recipe.trim() || !ingredients.trim()) {
      alert('Recipe and Ingredients are required');
      return;
    }
  
    const url = id ? `${API_URL}${id}` : API_URL;
    const method = id ? 'put' : 'post';
    
    const newData = { recipe, ingredients };
  
    axios[method](url, newData)
      .then((response) => {
        if (id) {
          setData(data.map((item) => (item._id === id ? response.data : item)));
        } else {
          setData([...data, response.data]);
          setRecipe(''); 
          setIngredients(''); 
        }
        setError(null);
      })
      .catch((error) => {
        console.error('There was an error!', error);
        setError('An error occurred while saving data.');
      });
  };
  

  const handleEdit = (_id) => {
    const itemToEdit = data.find((item) => item._id === _id);
    if (itemToEdit) {
      setRecipe(itemToEdit.recipe);
      setIngredients(itemToEdit.ingredients);
      setEditItem(_id);
    }
  };
  
  const handleDelete = (_id) => {
    axios
        .delete(`${API_URL}${_id}`)
        .then(() => {
            setData(prevData => prevData.filter((item) => item._id !== _id));
        })
        .catch((error) => {
            console.error('There was an error!', error);
        });
  };

  const handleUpdate = (e) => {
    handleSubmit(e, editItem); // Pass event and editItem ID
    setEditItem(null);
  };

  return (
    <div className="container-fluid m-5">
      <h2 className="text-center font-weight-bold">BOOK RECIPE</h2>
      <form onSubmit={editItem ? handleUpdate : handleSubmit}>
        <input
          type='text' 
          value={recipe}
          onChange={(e) => setRecipe(e.target.value)} 
          placeholder='Recipe'
        />

        <input
          type='text'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder='Ingredients'
        />

        <br /><br />
        <button className="btn btn-sm btn-primary" type='submit' >{editItem ? 'Update Recipe' : 'Add Recipe'}</button>
        
      </form>

      {error && <p>{error}</p>}
      <br />
      <table className="table">
        <thead>
          <tr>
            <th>Recipe</th>
            <th>Ingredients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.recipe}</td>
              <td>{item.ingredients}</td>
              <td>
                <button className="btn btn-sm btn-danger m-1" onClick={() => handleDelete(item._id)}>Delete</button>
                <button className="btn btn-sm btn-success m-1" onClick={() => handleEdit(item._id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataForm;
