import React from "react";
import { Card, Rate, Tag } from "antd";
import {
  EnvironmentOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Room } from "../types/room";
import { CURRENCY_SYMBOLS } from "../constants";
import ImageWithFallback from "./ImageWithFallback";

interface RoomCardProps {
  room: Room;
  onViewDetails: (roomId: string) => void;
  onAddToCompare: (roomId: string) => void;
  isInCompareList?: boolean;
  className?: string;
}

/**
 * Room card component for displaying room information in a grid
 * @param props - Component props
 * @returns JSX.Element
 */
const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onViewDetails,
  onAddToCompare,
  isInCompareList = false,
  className = "",
}) => {
  const formatPrice = (amount: number | undefined, currency: string) => {
    if (!amount) return "N/A";
    const symbol =
      CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getRoomTypeColor = (type: string) => {
    const colors = {
      assisted_living: "blue",
      independent_living: "green",
      memory_care: "orange",
      daycare: "purple",
    };
    return colors[type as keyof typeof colors] || "default";
  };

  const getCareLevelColor = (level: string) => {
    const colors = {
      high: "red",
      medium: "orange",
      low: "green",
    };
    return colors[level as keyof typeof colors] || "default";
  };

  return (
    <Card
      hoverable
      className={`h-full flex flex-col cursor-pointer ${className}`}
      onClick={() => onViewDetails(room.id)}
      cover={
        <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          {room.images && room.images.length > 0 ? (
            <ImageWithFallback
              alt={room.name}
              src={room.images[0]}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <ImageWithFallback
                alt="No image available"
                src=""
                className="w-16 h-16 opacity-50"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4">
            <Tag color={getRoomTypeColor(room.roomType)} className="capitalize">
              {room.roomType.replace("_", " ")}
            </Tag>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center space-x-2">
              <Rate
                disabled
                value={room.overallRating}
                style={{ fontSize: 14 }}
                className="text-yellow-400"
              />
              <span className="text-sm font-medium">
                {room.overallRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      }
      actions={[
        <button
          key="compare"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCompare(room.id);
          }}
          className={`w-full h-12 m-0 mb-0 p-0 flex items-center justify-center cursor-pointer transition-colors duration-200 border-0 rounded-b-lg ${
            isInCompareList
              ? "bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
              : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700"
          }`}
        >
          <SwapOutlined className="mr-2" />
          <span className="font-medium">
            {isInCompareList ? "Remove from Compare" : "Add to Compare"}
          </span>
        </button>,
      ]}
      styles={{
        body: { flex: 1, display: "flex", flexDirection: "column" },
        actions: {
          margin: 0,
          padding: 0,
          marginTop: 0,
          marginBottom: 0,
          borderTop: "none",
          borderBottom: "none",
          borderRadius: "0 0 8px 8px",
        },
      }}
    >
      <div className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={room.name}>
              {room.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3 truncate" title={room.facilityName}>
              {room.facilityName}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <EnvironmentOutlined className="mr-1 flex-shrink-0" />
            <span className="truncate" title={`${room.location.area}, ${room.location.city}`}>
              {room.location.area}, {room.location.city}
            </span>
          </div>

           {/* Pricing Section */}
           <div className="grid grid-cols-2 gap-3">
             <div className="text-center p-3 bg-gray-50 rounded-lg">
               <div className="text-lg font-bold text-primary-600">
                 {formatPrice(room.pricing.rent, room.pricing.currency)}
               </div>
               <div className="text-xs text-gray-500">Monthly Rent</div>
             </div>
             <div className="text-center p-3 bg-green-50 rounded-lg">
               <div className="text-lg font-bold text-green-600">
                 {formatPrice(room.totalCost, room.pricing.currency)}
               </div>
               <div className="text-xs text-gray-500">Total Cost</div>
             </div>
           </div>

           {/* Tags Section - Each tag on separate line */}
           <div className="space-y-2">
             <Tag
               color={getCareLevelColor(room.careLevel)}
               className="w-full text-center justify-center"
             >
               {room.careLevel} care
             </Tag>
             <Tag color="blue" className="w-full text-center justify-center">
               {room.occupancy}
             </Tag>
             <Tag color="purple" className="w-full text-center justify-center">
               {room.lengthOfStay} term
             </Tag>
           </div>

        </div>
      </div>
    </Card>
  );
};

export default RoomCard;
