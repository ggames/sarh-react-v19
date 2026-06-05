import { PointWithId } from "./point";
import { OrganizationalUnitWithId } from './organizationalUnit.d';
import { TransformationWithId } from "./transformation";
import { StatusOfPosition } from '../constants/StatusOfPosition';

export interface Position {
    
    point: PointWithId;
    organizationalUnit: OrganizationalUnitWithId;
    positionStatus: StatusOfPosition;
    newPosition: PositionWithId;
    parents:  PositionWithId[];
    pointsAvailable: number;
    creationResolution: TransformationWithId;
    resolutionSuppression: TransformationWithId ;
}

export interface PositionWithId extends Position {
    id: number;
}

export interface  PositionDto {
    id: number;
    namePosition: string;
    nameUnit?: string;
    pointsAvailable: number;
    amountPoint: number;
    positionStatus: StatusOfPosition;
    resolutionNumber: string;
    discountedQuantity: number;
}

export interface PositionRequest {
    point: number;
    organizational: number;
    originPositionIds?: number[];
    positionStatus?: (typeof StatusOfPosition)[number];
    resolutionTransformation: number;
}

export interface PositionRequestWithId extends PositionRequest {
    id?: number;
}

