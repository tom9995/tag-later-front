"use client";

import React, { useState } from "react";
import { Card as MuiCard } from "@mui/material";
import { Card, apiService, UpdateCardData } from "@/services/api";
import {
  CardActions,
  CardContent,
  EditDialog,
  DeleteDialog,
} from "./CardItem/index";

interface CardItemProps {
  card: Card;
  onUpdate: (updatedCard: Card) => void;
  onDelete: (cardId: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleFavorite = async () => {
    setIsUpdating(true);
    try {
      const updateData: UpdateCardData = {
        is_favorite: !card.is_favorite,
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
      } else {
        console.error("Failed to update favorite status:", response.error);
      }
    } catch (error) {
      console.error("Failed to update favorite status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleRead = async () => {
    setIsUpdating(true);
    try {
      const updateData: UpdateCardData = {
        is_read: !card.is_read,
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
      } else {
        console.error("Failed to update read status:", response.error);
      }
    } catch (error) {
      console.error("Failed to update read status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (title: string, description: string) => {
    setIsUpdating(true);
    try {
      const updateData: UpdateCardData = {
        title,
        description: description || undefined,
      };

      const response = await apiService.updateCard(card.id, updateData);
      if (response.success) {
        onUpdate(response.data);
        setIsEditing(false);
      } else {
        console.error("Failed to update card:", response.error);
      }
    } catch (error) {
      console.error("Failed to update card:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await apiService.deleteCard(card.id);
      if (response.success) {
        onDelete(card.id);
        setShowDeleteDialog(false);
      } else {
        console.error("Failed to delete card:", response.error);
      }
    } catch (error) {
      console.error("Failed to delete card:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <MuiCard
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <CardContent card={card} />
        <CardActions
          card={card}
          onToggleFavorite={handleToggleFavorite}
          onToggleRead={handleToggleRead}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          isUpdating={isUpdating}
        />
      </MuiCard>

      <EditDialog
        open={isEditing}
        card={card}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        isUpdating={isUpdating}
      />

      <DeleteDialog
        open={showDeleteDialog}
        card={card}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default CardItem;
