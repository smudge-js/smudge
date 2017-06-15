import PBR from './pbr1';

export default function bindUI(pbr: PBR) {

    let show_albedo_button = document.querySelector("#show_albedo");
    show_albedo_button.addEventListener("click", () => pbr.show_albedo());

    let download_albedo_button = document.querySelector("#download_albedo") as HTMLAnchorElement;
    download_albedo_button.addEventListener("click", () => {
        let data = pbr.get_albedo();
        console.log(data);
        download_albedo_button.href = data;
    });

    let show_metallic_button = document.querySelector("#show_metallic");
    show_metallic_button.addEventListener("click", () => pbr.show_metallic());

    let download_metallic_button = document.querySelector("#download_metallic") as HTMLAnchorElement;
    download_metallic_button.addEventListener("click", () => {
        download_metallic_button.href = pbr.get_metallic();
    });


    let show_height_button = document.querySelector("#show_height");
    show_height_button.addEventListener("click", () => pbr.show_height());

    let download_height_button = document.querySelector("#download_height") as HTMLAnchorElement;
    download_height_button.addEventListener("click", () => {
        download_height_button.href = pbr.get_height();
    });

}
