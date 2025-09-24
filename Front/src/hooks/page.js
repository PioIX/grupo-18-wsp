"use client"

import Button from "@/app/componentes/Button/Button";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";

export default function socketPage() {

    const {socket, isConnected} = useSocket();
    const {message, setMessage} = useState("")

    useEffect(() => {
        if (!socket) return

        socket.on("pingAll", recibido => {
            console.log("PING RECIBIDO: ", recibido)
        })

        socket.on("newMessage", data => {
            console.log("MENSAJE NUEVO: ", data)
        })

    }, [socket])	


    function pingAll(){
        socket.emit("pingAll", 
            {mensaje:"ping desde el front"
        })
    }

    function joinRoom(){
        socket.emit("joinRoom", 
            {room:"pio"
        })
    }

    function handleInput(event){
        setMessage(event.target.value)
    }

    function sendMessage(){
        socket.emit("sendMessage", { message, id: 1 })
    }

    return(
        <>
            <h1>Pagina del socket</h1>

            <Button text={"PingAll"} onClick={pingAll}></Button>
            <Button text={"JoinRoom"} onClick={joinRoom}></Button>

            <Input onChange={handleInput}></Input>
            <Button text={"sendMessage"} onClick={joinRoom}></Button>
        </>
    )
}