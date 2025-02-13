import { IoMenu, IoSearch, IoCart,IoPerson } from "react-icons/io5";
import logo from "../assets/nav1.png"
export default function NavBar() {
    return (
        <>
            <header className="h-[298px] max-w-screen text-primary cont">
                <menu className="flex flex-row justify-between items-center ">
                    <span className="flex flex-row items-center">
                        <IoMenu className="w-[24px] h-[28px] font-semibold" />
                        <h1 className="h-fit w-fit font-lora font-[700] leading-[40.96px] tracking-[0] text-[32px]">Menu</h1>
                    </span>
                    <img className="w-[200px] h-[200px]" src={logo} alt="African star coffee logo"/>
                    <span className="flex flex-row items-center">
                        <IoSearch className="w-[35px] h-[35px] font-semibold"/>
                         <IoCart className="w-[44px] h-[39px] font-semibold" />
                         <IoPerson className="w-[36px] h-[36px] font-semibold" />   
                    </span>
                </menu>


            </header>
        </>
    )
}