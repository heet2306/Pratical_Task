const TryCatch=(handler)=>{
    return (req,res,next)=>{
        try{
            handler(req,res,next);
        }catch(error){
            es.status(500).json({ message: error.message });
        }
    }
}
export default TryCatch;