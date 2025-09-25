import React from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles';

interface CrudActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
  itemName?: string;
  isActive?: boolean;
}

const CrudActions: React.FC<CrudActionsProps> = ({
  onEdit,
  onDelete,
  onToggleStatus,
  canEdit = true,
  canDelete = true,
  itemName = "elemento",
  isActive = true,
}) => {
  const handleToggleStatus = () => {
    const action = isActive ? "desactivar" : "activar";
    Alert.alert(
      `Confirmar ${action}`,
      `¿Estás seguro de que deseas ${action} este ${itemName}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          onPress: onToggleStatus,
        },
      ]
    );
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      {canEdit && onEdit && (
        <TouchableOpacity
          onPress={onEdit}
          style={{
            backgroundColor: colors.primary + '15',
            padding: 10,
            borderRadius: 12,
            marginRight: 8,
          }}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}

      {onToggleStatus && (
        <TouchableOpacity
          onPress={handleToggleStatus}
          style={{
            backgroundColor: (isActive ? '#f59e0b' : '#10b981') + '15',
            padding: 10,
            borderRadius: 12,
            marginRight: 8,
          }}
        >
          <Ionicons 
            name={isActive ? "pause-circle-outline" : "play-circle-outline"} 
            size={20} 
            color={isActive ? '#f59e0b' : '#10b981'} 
          />
        </TouchableOpacity>
      )}

      {canDelete && onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={{
            backgroundColor: (isActive ? '#f59e0b' : '#10b981') + '15',
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Ionicons 
            name={isActive ? "close-circle-outline" : "checkmark-circle-outline"} 
            size={20} 
            color={isActive ? '#f59e0b' : '#10b981'} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CrudActions;