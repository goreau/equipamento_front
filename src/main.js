import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'


import '../node_modules/bulma/css/bulma.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import '../node_modules/tabulator-tables/dist/css/tabulator_bulma.min.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faFilePdf, faFileExcel, faFileCsv, faFileLines, faHouse, faUser, faUsers, faLock, faEdit, faTrash, faCheck, faBan, faSearch, faScrewdriverWrench, faSprayCanSparkles, faArrowRightArrowLeft} from '@fortawesome/free-solid-svg-icons'


/* add icons to the library */
library.add(faUserSecret, faFilePdf, faFileExcel, faFileCsv, faFileLines, faHouse, faUser, faUsers, faLock, faEdit, faTrash, faCheck, faBan, faSearch, faScrewdriverWrench, faSprayCanSparkles, faArrowRightArrowLeft);


createApp(App)
.use(store)
.use(router)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
