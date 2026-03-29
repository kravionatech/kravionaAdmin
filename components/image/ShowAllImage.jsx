import React, { useState } from "react";
import { Trash2, Link as LinkIcon, Plus } from "lucide-react";

const ShowAllImage = ({ chooseImage, imageModel, setImageModel }) => {
  // 10 Dummy images with an aesthetic matching your teal/terracotta palette
  const [images, setImages] = useState([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500&q=80",
      name: "Modern Lounge",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80",
      name: "Teal Office",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=500&q=80",
      name: "Minimalist Desk",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1534349762230-e0cadf78f505?w=500&q=80",
      name: "Terracotta Vase",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1513519247388-193ad513d746?w=500&q=80",
      name: "Abstract Teal",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1594913785162-e6785b423cb1?w=500&q=80",
      name: "Clay Pottery",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80",
      name: "Tech Setup",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500&q=80",
      name: "Mood Lighting",
    },
    {
      id: 9,
      url: "https://www.kisworks.com/blog/wp-content/uploads/2024/06/Top-10-Reasons-to-Choose-an-Indian-Website-Development-Company-in-2024-.jpg",
      name: "Interior Detail",
    },
    {
      id: 10,
      url: "https://bigblue.academy/images/image/blog/what-is-machine-learning-2023-beginners-guide/1-3cxboknql4qs-lryht3pqw.jpg",
      name: "Architecture",
    },
  ]);

  return (
    <div className="h-[70vh] w-full bg-[#11393b]  p-8 text-white overflow-y-scroll">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            onClick={() => {
              chooseImage({ ...img });
              setImageModel(!imageModel);
            }}
            key={img.id}
            className="group relative bg-[#295c5e]/10 border border-[#295c5e]/30 rounded-2xl overflow-hidden hover:border-[#f4be78]/50 transition-all duration-300"
          >
            {/* Image Preview */}
            <div className="aspect-square overflow-hidden">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Label */}
            <div className="p-3 bg-[#0f2425]/80 backdrop-blur-sm border-t border-[#295c5e]/30">
              <p className="text-xs font-medium text-gray-300 truncate">
                {img.name}
              </p>
              <p className="text-[10px] text-[#295c5e]">1200 x 800 px</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowAllImage;
