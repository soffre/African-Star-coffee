
import NavBar from "./components/NavBar"
import coffee1 from "./assets/Hero_image2.png"
import coffee2 from "./assets/Hero_image1.png"
import logo2 from "./assets/about_image1.png"
function App() {


  return (
    <>
      <NavBar />
      <section id="Hero_section" className=" h-[708px]">
        <div className="cont">
          <span className="flex flex-row items-center lg:justify-between md:justify-evenly sm:justify-evenly">
            <div>
              <h1 className=" w-[600px] h-[251.39px] font-playfair font-[400] text-[96px] leading-[127.97px] text-fivthary">African Start Coffee</h1>
              <p className="w-[420px] h-[161px] opacity-[80%] text-black font-lora font-[400] text-[32px] leading-[41px]">We sell Premium Ethiopian Coffee, Renowned for its quality for local & International Markets.</p>
            </div>
            <img className="w-[689px] h-[511.61px]" src={coffee2} alt="Coffee bag" />
          </span>
        </div>
        <div style={{ backgroundImage: `url(${coffee1})` }}
          className="bg-cover bg-center h-[300px] w-full">
          <span className="cont flex flex-row gap-8 h-[90px]">
            <button className="w-[183px] h-[62.85px] text-fourthary font-lora font-[400] text-[32px] leading-[40.96px] bg-secondary text-center rounded hover:scale-110 transition-transform duration-600 ease-in-out">Shop Now</button>
            <button className="w-[183px] h-[62.85px]  text-primary font-lora font-[400] text-[32px] leading-[40.96px] bg-fourthary border-1 border-secondary text-center rounded hover:scale-110 transition-transform duration-600 ease-in-out">Contact</button>
          </span>
        </div>
      </section>

      <section id="about-section" className="h-[728px] bg-primary">
        <dev className="cont flex flex-row  items-center justify-evenly">
          <img className="w-[906px] h-[828px] ml-[-200px] mt-[-100px] text-center" src={logo2} alt="African Star coffee logo"/>
          <span>
            <h2 className="pb-8 font-playfair font-[700] text-[48px] leading-[63-98px] text-fourthary">About Us</h2>
            <p className="w-[613px] font-lora font-[400] text-[24px] leading-[47px] text-fourthary">Our company focuses on both local and global coffee markets. We sell premium Ethiopian coffe, renowned 
              for its quality, in local markets while also exporting a diverse range of coffe varietes from Ethiopian 
              and other African countries worldwide. Our business is centerd around the production of high-quality coffee, 
              sourced directly from Ethiopia's rich coffee-growing region, and making it accessible to coffee lovers globally through retail channels and direct exports.</p>
          </span>
        </dev>
      </section>


      <section id="services"  className="cont bg-fourthary my-28 h-[887px]">
       <h2 className="text-[48px] font-playfair font-[700] leading-[64px] text-primary">Services</h2>
        <div>

        </div>
      </section>
    </>
  )
}

export default App
