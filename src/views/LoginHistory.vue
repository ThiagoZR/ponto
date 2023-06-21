<template>
  <div class="container">
    <div class="header">
      <img src="../assets/img/Logo.svg"/>
      <h1 class="name">Olá, {{ name }}!</h1>
    </div>
    <div class="info">
      <p>{{ formattedDate }}</p>
      <p>{{ currentTime }}</p>
      <p class="-orange">Tempo {{ timer }}</p>
    </div>
    <div class="btn-group">
      <Vbutton @click="postDetail">CHEGUEI</Vbutton>
      <Vbutton @click="putDetail('fuiAlmocar')">FUI ALMOÇAR</Vbutton>
      <Vbutton @click="putDetail('voltei')">VOLTEI</Vbutton>
      <Vbutton @click="putDetail('fui')">FUI</Vbutton>
    </div>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora início</th>
            <th>Almoço início</th>
            <th>Almoço Fim</th>
            <th>Hora Fim</th>
            <th>Tempo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in items" :key="item.idDetail" :class="rowColor(index)">
            <td>{{ item.date }}</td>
            <td>{{ item.start }}</td>
            <td>{{ item.startLunch }}</td>
            <td>{{ item.endLunch }}</td>
            <td>{{ item.end }}</td>
            <td> {{ timer }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Vbutton from "../components/vbutton.vue";
import { format } from "date-fns";
import { zonedTimeToUtc } from 'date-fns-tz';
import axios from "axios";
import { http } from "../services/config"

const name = ref('');
const currentDate = ref(null);
const formattedDate = ref('');
const currentTime = ref('');

const timer = ref(0);

const token = ref('')

const items = ref([]);

const dateToPost = ref('')
const hasClickedToday  = ref ('')

const dataToSent = ref('')

const hasCheguei = ref(false);
const hasFuiAlmocar = ref(false);
const hasVoltei = ref(false);
const hasFui = ref(false);

const sameDayIdDetail = ref(null);

onMounted(() => {
  login()
  convertToISOString();
  getCurrentDateAndHour();
  getList();
  sameDayIdDetail.value = JSON.parse(localStorage.getItem('sameDayIdDetail'));

  const storedCheguei = localStorage.getItem('hasCheguei');
  const storedFuiAlmocar = localStorage.getItem('hasFuiAlmocar');
  const storedVoltei = localStorage.getItem('hasVoltei');
  const storedFui = localStorage.getItem('hasFui');

  if (storedCheguei !== null) {
    hasCheguei.value = JSON.parse(storedCheguei);
  }

  if (storedFuiAlmocar !== null) {
    hasFuiAlmocar.value = JSON.parse(storedFuiAlmocar);
  }

  if (storedVoltei !== null) {
    hasVoltei.value = JSON.parse(storedVoltei);
  }

  if (storedFui !== null) {
    hasFui.value = JSON.parse(storedFui);
  }

  // const idsToDelete = [1959]; // IDs que deseja deletar
  // deleteDetail(idsToDelete);

});

async function login(){
  try{
    const data = {
      userID: "amanda.kanashiro@thera.com.br",
      accessKey: "123456",
      grantType: "password"
    };
    const response = await axios.post('https://theraponto.dev.thera.com.br:4433/api/Accounts', data);

    window.localStorage.setItem("accessToken", response.data.accessToken);
    token.value = response.data.accessToken
    name.value = response.data.name
    return response;

  } catch (error){
    console.error(error)
    throw error
  }
}

async function getList() {
  return http.get('/Timesheet')
    .then(function(response){
      items.value = response.data
      items.value = items.value.items

      items.value = items.value.map(item => {
        const { id, start, startLunch, endLunch, end } = item

        const formatarHorarioSoma = (horario) => {
          const horas = new Date(horario)
          horas.value = zonedTimeToUtc(horas, "America/Sao_Paulo");
          horas.setHours(horas.getHours() + 3);
          const horarioFormatado = horas.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          return horarioFormatado
        }

        const formatarHorario = (horario) => {
          const horas = new Date(horario)
          horas.value = zonedTimeToUtc(horas, "America/Sao_Paulo");
          const horarioFormatado = horas.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          return horarioFormatado
        }

        const formatarData = (dateString) => {
          const date = new Date(dateString)
          return format(date, 'dd/MM/yyyy')
        }

        return {
          id,
          date: formatarData(start),
          start: formatarHorarioSoma(start),
          startLunch: item.startLunch == undefined ? 'Sem registro' : formatarHorario(startLunch),
          endLunch: item.endLunch == undefined ? 'Sem registro' : formatarHorario(endLunch),
          end: item.end == undefined ? 'Sem registro' : formatarHorario(end)
        }
      })

      
      return items
    }
  )
}

async function deleteDetail(ids) {
  const deletePromises = ids.map((id) => {
    return http.delete(`/Timesheet/${id}`);
  });

  try {
    const responses = await Promise.all(deletePromises);
    console.log('IDs deletados com sucesso:', responses);
  } catch (error) {
    console.error('Erro ao deletar IDs:', error);
  }
}

async function postDetail(){
  convertToISOString()

  // Verifica se o usuário já realizou o registro no mesmo dia
  hasClickedToday.value = items.value.some((item) => {
    const data = new Date();
    const day = String(data.getDate()).padStart(2, '0');
    
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const year = String(data.getFullYear());
    const currentDate = `${day}/${month}/${year}`;  

    return (
      currentDate === item.date
    );
  });

  if (hasClickedToday.value) {
    alert("Ponto já registrado!")
    // return;
  } else if(hasCheguei.value && !hasClickedToday.value){
    sameDayIdDetail.value = null;
    hasCheguei.value = false;
    hasFuiAlmocar.value = false;
    hasVoltei.value = false;
    hasFui.value = false;

    // Limpar valores do localStorage
    localStorage.removeItem('sameDayIdDetail');
    localStorage.removeItem('hasCheguei');
    localStorage.removeItem('hasFuiAlmocar');
    localStorage.removeItem('hasVoltei');
    localStorage.removeItem('hasFui');
  } else {

    const data = {
      start: dateToPost.value,
    };

    return http
      .post('/Timesheet', data)
      .then((response) => {
        sameDayIdDetail.value = response.data.id;

        localStorage.setItem('sameDayIdDetail', JSON.stringify(sameDayIdDetail.value));

        hasCheguei.value = true
        localStorage.setItem('hasCheguei', JSON.stringify(hasCheguei.value));
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      }
    );
  }
}

async function putDetail(type){
  convertToISOString()

  const idDetail = sameDayIdDetail.value;
  
    if(type === 'fuiAlmocar'){
      if (!hasCheguei.value || hasFuiAlmocar.value) {
        alert("Verifique se o ponto 'CHEGUEI' já foi registrado ou se você já registrou o ponto 'FUI ALMOÇAR'")
        return;
      } 

      dataToSent.value = {
        startLunch: dateToPost.value,
      }
      
      hasFuiAlmocar.value = true;
      localStorage.setItem('hasFuiAlmocar', JSON.stringify(hasFuiAlmocar.value));
    }

    if(type === 'voltei'){
      if (!hasFuiAlmocar.value || hasVoltei.value) {
        alert("Verifique se o ponto 'FUI ALMOÇAR' já foi registrado ou se você já registrou o ponto 'VOLTEI'")
        return;
      }

      dataToSent.value = {
        endLunch: dateToPost.value,
      }

      hasVoltei.value = true;
      localStorage.setItem('hasVoltei', JSON.stringify(hasVoltei.value));
    } 

    if(type === 'fui'){

      if (!hasVoltei.value || hasFui.value) {
        alert("Verifique se o ponto 'VOLTEI' já foi registrado ou se você já registrou o ponto 'FUI'")
        return;
      }

      dataToSent.value = {
        end: dateToPost.value,
      } 

      hasFui.value = true
      localStorage.setItem('hasFui', JSON.stringify(hasFui.value));
    }
    
    http
      .put(`/Timesheet/${idDetail}`, dataToSent.value)
      .then((response) => {
        console.log(response)
        window.location.reload()

      })
      .catch(function(error){
        console.log(error)
      }
    )
}


function getCurrentDateAndHour() {
  const date = new Date();
  currentDate.value = date;
  formattedDate.value = format(currentDate.value, 'dd/MM/yyyy');
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;  

}

function convertToISOString(){
  const date = new Date();
  dateToPost.value = date.toISOString();
  return dateToPost
}

function rowColor(index){
  return index % 2 === 0 ? '-gray' : '-white';
}

</script>

<style lang="scss" scoped>
.-white{
  background-color: #fff;
}

.-gray {
  background-color: #E8E8E8;
}

.-orange {
  color: #FCCD2A;
}

table {
  width: 1150px;
}
th{
  min-width: 200px;
  color: #FCCD2A;
}

tbody{
  tr{
    border-bottom: 3px solid #1E5084;
    td{
      color: #000;
      padding: 10px;
      border-left: 2px solid #1E5084;
      text-align: center;
    }
  }
}
.container{
  display: flex;
  flex-direction: column;
  font-size: 30px;
  font-weight: 700;
  .header{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 45px;

    .name{
      margin-left: 60px;
    }
  }

  .info {
    display: inline-flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 45px;
  }
  .btn-group{
    display: flex;
    margin: auto;
    flex-wrap: wrap;
  }

  .table{
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: nowrap;
    font-weight: 500;
  }
}
</style>