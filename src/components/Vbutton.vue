<template>
  <div>
    <button class="btn"><slot></slot></button>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.btn{
  border: 4px solid #FCCD2A;
  font-size: 30px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 5px;
  padding: 11px 28px;
  background-color: transparent;
  margin: 40px;
  min-width: 200px;

  &:hover{
    background-color: #FCCD2A;
    color: #1E5084;
    cursor: pointer;
  }
}
</style>