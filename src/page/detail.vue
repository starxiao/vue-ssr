<template>
    <div class="detail">
        <p>{{userid}}</p>
    </div>
</template>
<script>
export default {
    name: 'userid',
    data(){
        return{
            userid: 0
        }
    },
    mounted: function(){
        this.userid = 'detail';
    },
    methods:{

    }
}
</script>

