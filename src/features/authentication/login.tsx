import type { NextPage } from "next";
import Image from "next/image";

const Login2: NextPage = () => {
  return (
    <div className="w-full relative flex flex-col items-center justify-center py-[225px] px-[30px] box-border bg-[url('/Login-2@3x.png')] bg-cover bg-no-repeat bg-[top] leading-[normal] tracking-[normal]">
      <div className="w-[1920px] h-[1080px] relative hidden max-w-full shrink-0">
        <div className="absolute top-[1080px] left-[1920px] [background:linear-gradient(251.56deg,_#e0e5eb,_#0a496a)] w-full h-full [transform:_rotate(180deg)] [transform-origin:0_0]" />
        <Image
          className="absolute top-[0px] left-[0px] w-full h-full"
          width={1920}
          height={1080}
          sizes="100vw"
          alt=""
          src="/Fondo-geom.svg"
        />
      </div>
      <form className="m-0 w-full shadow-[0px_7.1px_16.8px_4.42px_rgba(0,_0,_0,_0.25)] rounded-[26.5px] bg-[#f5f7fa] flex flex-col items-start justify-center pt-[29.1px] pb-[29.2px] pl-[35px] pr-9 box-border gap-[23.2px] max-w-[578px] shrink-0 mq578:max-w-full mq630:pt-5 mq630:pb-5 mq630:box-border">
        <div className="w-[44.9px] h-[50.6px] flex items-start pt-0 px-0 pb-[5.7px] box-border">
          <Image
            className="cursor-pointer [border:none] p-0 bg-[transparent] h-[44.9px] w-full relative"
            width={44.9}
            height={44.9}
            sizes="100vw"
            alt=""
            src="/btn-back.svg"
          />
        </div>
        <div className="self-stretch flex items-start py-0 px-px box-border max-w-full">
          <div className="flex-1 shadow-[0px_1px_4px_rgba(0,_0,_0,_0.25)] rounded-[25px] bg-[#c7e7fe] flex items-center justify-center pt-5 px-0 pb-[18.7px] box-border max-w-full">
            <div className="flex-1 flex items-end flex-wrap content-end gap-[3px] max-w-[370.1px]">
              <Image
                className="w-[87px] relative max-h-full object-cover"
                loading="lazy"
                width={87}
                height={88.3}
                sizes="100vw"
                alt=""
                src="/logoComunidadConectada-2@2x.png"
              />
              <Image
                className="flex-1 relative max-w-full overflow-hidden max-h-full object-cover min-w-[223px]"
                loading="lazy"
                width={280}
                height={77.5}
                sizes="100vw"
                alt=""
                src="/logoComunidadConectada-1@2x.png"
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col items-start pt-[8.8px] px-0 pb-0 box-border gap-[9px] max-w-full">
          <div className="self-stretch flex flex-col items-start">
            <b className="self-stretch relative text-[15.8px] leading-[22.5px] font-[Inter] text-[#374151] text-left">
              Correo electronico
            </b>
          </div>
          <div className="self-stretch h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] box-border overflow-hidden shrink-0 flex items-start justify-center py-2.5 px-[18px] max-w-full">
            <input
              className="w-full [border:none] [outline:none] bg-[transparent] h-[27px] flex-1 flex items-center font-[Inter] text-lg text-[#8a8f96] min-w-[250px] max-w-full"
              placeholder="comunidadconectada@gmail.com"
              type="text"
            />
          </div>
        </div>
        <div className="self-stretch flex flex-col items-start pt-0 px-0 pb-3 box-border gap-[9px] max-w-full">
          <div className="self-stretch flex flex-col items-start">
            <b className="self-stretch relative text-[15.8px] leading-[22.5px] font-[Inter] text-[#374151] text-left">
              Contraseña
            </b>
          </div>
          <div className="self-stretch h-[51.7px] rounded-[13.5px] bg-[#f9fafb] border-[#e5e7eb] border-solid border-[1.1px] box-border overflow-hidden shrink-0 flex items-start justify-center py-2.5 px-[18px] max-w-full">
            <div className="flex-1 flex items-center flex-wrap content-center gap-0 max-w-full [row-gap:20px]">
              <input
                className="w-[calc(100%_-_18.9px)] [border:none] [outline:none] bg-[transparent] h-[27px] flex-1 overflow-hidden flex items-start font-[Inter] text-lg text-[#8a8f96] min-w-[281px] max-w-full"
                placeholder="*******"
                type="text"
              />
              <Image
                className="h-[25.7px] w-[34.7px] relative"
                width={34.7}
                height={25.7}
                sizes="100vw"
                alt=""
                src="/Button-menu-margin.svg"
              />
            </div>
          </div>
        </div>
        <button
          className="cursor-pointer [border:none] py-0 px-px bg-[transparent] self-stretch flex items-start box-border max-w-full"
          type="submit"
        >
          <div className="flex-1 rounded-[10.6px] bg-[#0a496a] flex items-center justify-center pt-[14.1px] px-0 pb-[13.9px] box-border max-w-full">
            <div className="flex-1 relative text-[18.2px] leading-[150%] font-black font-['Satoshi_Variable'] text-[#f5f7fa] text-center inline-block max-w-full">
              Iniciar Sesión
            </div>
          </div>
        </button>
        <div className="self-stretch flex items-center justify-center py-[2.8px] px-0 z-[0]">
          <div className="flex-1 relative text-[18.2px] leading-[150%] text-right flex items-center w-[287.1px] shrink-0 max-w-[287px] z-[1]">
            <span className="w-full">
              <span className="font-light font-['Satoshi_Variable'] text-[#000] leading-[150%]">{`¿No tienes una cuenta? `}</span>
              <span className="font-medium font-['Satoshi_Variable'] text-[#0a496a] leading-[150%]">
                Registrarse
              </span>
            </span>
          </div>
          <div className="h-6 w-[101px] relative bg-[#f5f7fa] z-[2] ml-[-96.2px]" />
        </div>
      </form>
    </div>
  );
};

export default Login2;
