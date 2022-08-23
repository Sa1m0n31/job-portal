import React, {useEffect, useRef, useState} from 'react';
import Slider from 'react-slick'
import settings from '../static/settings'

const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true
}

const Gallery = ({images, index, setIndex}) => {
    const sliderRef = useRef(null);
    const sliderGalleryRef = useRef(null);

    const [render, setRender] = useState(false);

    useEffect(() => {
        document.addEventListener('keyup', (e) => {
           if(e.key === 'Escape') {
               setIndex(-1);
           }
        });

        if(sliderGalleryRef?.current) {
            sliderGalleryRef.current.slickGoTo(index);
            setRender(true);
        }
    }, []);

    return <div className={!render ? "fullScreenGallery opacity-0" : "fullScreenGallery"} ref={sliderRef}>
            <button className="fullScreenGallery__close"
                    onClick={() => { setIndex(-1); }}>
                &times;
            </button>
            <div className="fullScreenGallery__inner">
                <Slider ref={sliderGalleryRef}
                        {...sliderSettings}>
                    {images?.map((item, index) => {
                        return <div className="fullScreenGallery__item center" key={index}>
                            <img className="img" src={`${settings.API_URL}/${item}`} alt="produkt" />
                        </div>
                    })}
                </Slider>
            </div>
    </div>
};

export default Gallery;
