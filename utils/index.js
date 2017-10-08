export function promisify(fn,scope){
    return (opt)=>{
        return new Promise((res,rej)=>{
            fn.call(scope,{
                ...opt,
                success:res,
                fail:(...args)=>{
                    console.log("Fail",args)
                    rej(...args)
                }
            })
        })
    }
}
export function booleanPromisify(fn,scope){
    return (opt)=>new Promise((res)=>{
        fn.call(scope,{
            ...opt,
            success:()=>res(true),
            fail:()=>res(false)
        })
    })
}