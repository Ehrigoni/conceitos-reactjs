import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  
  /* inicialização da variável persistente repositories
     e de seu método setRepositories
  */
  const [repositories, setRepositories] = useState([]);
  /*
    Essa função dispara sempre qu ocorrer uma mudança de estado
  */
  useEffect(() => {
    //obtém os diretórios que se encontramna API
    async function loadData() {
      const response = await api.get('repositories');

      const loadedRepositories = response.data;

      setRepositories(loadedRepositories);
    }
    loadData();
  }, []);

  async function handleAddRepository() {
    //recebe o resultado do cadastro de novo projeto na API
    const newRepository = {
      title: `New Repository ${Date.now()}`,
      url: "www.code.com.br",
      techs: ["NodeJS", "ReactJS"]
    };
    
    const response = await api.post('/repositories', newRepository);
    
    const addedRepo = response.data;
    
    //se a inserção no back-end foi bem sucedida, então atualiza o front-end
    if (response.status === 200) {
          setRepositories([...repositories, addedRepo]);
    };
    
  };

  async function handleRemoveRepository(id) {
    
    //apaga do back-end
    const response = await api.delete(`/repositories/${id}`); 

    //testa para ver se o repositório retornou sem conteúdo, ou seja, foi apagado
    if (response.status === 204) {
      
      const currentRepositories = repositories.filter(repository => repository.id != id);
      
      setRepositories(currentRepositories);
    }
    
  }
  
  return (
    <div>
       <ul data-testid="repository-list">
         {repositories.map(repository => (
         
          <li key={repository.id}>
               {repository.title}
               <button onClick={()=>handleRemoveRepository(repository.id)}>Remover</button>
            </li>
         ))}

        </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
