import mongoose,{Document,Types,Schema} from "mongoose"

interface IDocument extends Document { 
    user:Schema.Types.ObjectId;
    title:String;
    fileUrl:String;
    originalText:String;
    simplifiedText:String;
    aiHighlights:Array<{
        clause:String;
        riskLevel:"Low" | "Medium" | "High";
        suggestion:String
    }>;
    processedByAI?: boolean;
    documentType?: string;
    createdAt: Date;
    updatedAt: Date;
}


const documentSchema = new mongoose.Schema<IDocument>({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    fileUrl:{
        type:String,
    },
    originalText:{
        type:String,
        required:true,
    },
    simplifiedText:{
        type:String,
    },
    aiHighlights:[
        {
            clause:{
                type:String,
            },
            ristLevel:{
                type:String,
            },
            suggestion:{
                type:String,
            },
        },
    ],
    processedByAI:{
        type:String,
        default:false,
    },
    documentType:{
        type:String,
    },

},{
    timestamps:true,
})


module.exports= mongoose.model<IDocument>("Document",documentSchema);