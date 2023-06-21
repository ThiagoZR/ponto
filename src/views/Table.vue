<template>
  <table>
    <thead>
      <tr>
        <th>Data</th>
        <th>Início</th>
        <th>Início Almoço</th>
        <th>Fim Almoço</th>
        <th>Fim</th>
        <th>Ação</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="item.id">
        <td>{{ item.date }}</td>
        <td>{{ item.start }}</td>
        <td>{{ item.startLunch }}</td>
        <td>{{ item.endLunch }}</td>
        <td>{{ item.end }}</td>
        <td>
          <button @click="() => registerAction(index, 'CHEGUEI')">CHEGUEI</button>
          <button @click="() => registerAction(index, 'FUI_ALMOCAR')">FUI ALMOÇAR</button>
          <button @click="() => registerAction(index, 'VOLTEI')">VOLTEI</button>
          <button @click="() => registerAction(index, 'FUI')">FUI</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref } from 'vue';

props: {
  items: Array
}

const registerAction = (index, action) => {
  // Chame a API aqui para registrar a ação no servidor

  // Obtenha uma cópia dos itens
  const updatedItems = [...props.items];

  // Atualize os dados do item de acordo com a ação realizada
  switch (action) {
    case 'CHEGUEI':
      updatedItems[index].start = getTime(); // Atualize o horário de início
      break;
    case 'FUI_ALMOCAR':
      updatedItems[index].startLunch = getTime(); // Atualize o horário de início do almoço
      break;
    case 'VOLTEI':
      updatedItems[index].endLunch = getTime(); // Atualize o horário de fim do almoço
      break;
    case 'FUI':
      updatedItems[index].end = getTime(); // Atualize o horário de fim
      break;
  }

  // Atribua os itens atualizados de volta à propriedade 'items'
  props.items = updatedItems;
};

const getTime = () => {
  // Implemente sua lógica para obter o horário atual aqui
  return new Date().toLocaleTimeString();
};
</script>
