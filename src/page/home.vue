<template>
    <div class="container">
        <p>hello xiaoxx111111123123 !</p>
        <p>{{item}}</p>
    </div>
</template>
<script type="text/javascript">
    import {initItem} from '~util/index';
    export default{
        data:function () {
            return{
                item: 0
            }
        },
        mounted: function(){
            let a = 123123;
            console.log(a);
            this.setItem();
        },
        methods:{
            setItem(){
                let item = 123;
                this.item = initItem();
            }
        }
    }
</script>