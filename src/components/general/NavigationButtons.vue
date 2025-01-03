<template>
  <div class="columns">
    <div class="column is-offset-1 is-3">
        <div class="field is-horizontal">
            <label class="label">Registros por página:  </label>
            <div class="select">
                <select v-model="pageTam">
                    <option value="5">5 registros</option>
                    <option value="10">10 registros</option>
                    <option value="20">20 registros</option>
                    <option value="50">50 registros</option>
                </select>
            </div>
        </div>
    </div>
    <div class="column is-4">
        <label class="label">Página {{ focused }}/{{ size }} - (Total de {{ total }} registros)</label>
    </div>
    <div class="column has-text-center dvnav">
        <button class="button is-outlined btnav" v-if="isFirst" @click="$emit('toPage',1)">&lt;&lt;</button>
        <button class="button is-outlined btnav" v-if="isBefore" @click="$emit('toPage', focused - 1)">&lt;</button>
        <span v-if="hasInfinit">
            <button class="button is-outlined btnav" 
                v-bind:class="(item == focused) ? 'hasfocus' : ''" v-for="(item, index) in pages.slice(first, last)" :key="index"
                @click="$emit('toPage', item)">{{ item }}</button>
        </span>
        <button class="button is-outlined btnav" v-if="isAfter" @click="$emit('toPage', focused + 1)">&gt;</button>
        <button class="button is-outlined btnav" v-if="isLast" @click="$emit('toPage', tam)">&gt;&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'navigationbuttons',
    props: {
        pages: {
                type: Array
            },
        focused: {
            type: Number
        },
        perPage: {
            type: Number
        },
        total: {
            type: Number
        }
    },
    emits: ['toPage','pageSize'],
    data() {
        return {
            first: 1,
            last: 1,
            isFirst: false,
            isLast: false,
            isBefore: false,
            isAfter: false,
            hasInfinit: false,
            size: 1,
            pageTam: 10,
        }
    },
    watch: {
        pages() {
            this.dealNav();           
        },
        focused() {
            this.dealNav();
        },
        pageTam() {
            this.$emit('pageSize', this.pageTam);
        }
    },
    methods: {
        dealNav() {
            this.size = this.pages.length;
            this.isFirst = false;
            this.isBefore = false;
            this.isLast = false;
            this.isAfter = false;

            this.hasInfinit = this.size > 1;
            if (this.hasInfinit) {
                this.first = this.focused > 4 ? (this.focused - 4  > (this.size - 7) ? this.size - 7 : this.focused - 4) : 0;
                this.last = this.focused + 3 < this.size ? (this.focused + 3 < 7 ? this.focused + (7 - this.focused) : this.focused + 3) : this.size;

                this.isFirst = this.first > 0;
                this.isBefore = this.focused > 1;
                this.isLast = this.focused < (this.size - 3);
                this.isAfter = this.focused < this.size;
            } 
        }
    }
}
</script>

<style scoped>
label {
    padding-top: .5rem;
    margin-right: 2rem;
    text-align: center;
}
.dvnav {
    padding-right: 2rem;
}
.btnav {
    height: 2rem;
    width: 2rem;
    color: rgb(27, 132, 238);
    background-color: transparent;
}

.btnav:hover {
    color: rgb(19, 90, 160);
    background-color: #DDD;
}
.hasfocus {
    background-color: #EEE;
}
</style>