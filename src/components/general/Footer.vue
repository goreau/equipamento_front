<template>
    <div id="footer">
            <img src="@/assets/CCD.png" alt="img" class="logo" />
          <p>Coordenadoria de Controle de Doenças &copy; 2024</p>
      </div> 
  </template>
  
  <script>
  export default {
      name: 'FooterView'
  }
  </script>
  
  <style scoped lang="scss">
  @import "@/components/general/css/custom-var";
      #footer{
          background-color: $base-bg;
          border-top: 6px solid #020538;
          
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          color: #020538;
          height: 3rem;
          z-index: 98;
          position:fixed;
          margin-bottom:0px;
      }
      .logo {
        width: 120px;
        height: 40px;
      }
  </style>