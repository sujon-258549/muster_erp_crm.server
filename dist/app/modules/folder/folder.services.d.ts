export declare const FolderServices: {
    createFolder: (payload: any) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
    getAllFolders: (query: any) => Promise<{
        data: {
            folders: any[];
            images: {
                name: string;
                url: string;
                id: string;
            }[];
        };
    }>;
    getFolderById: (id: string) => Promise<{
        children: any[];
        images: {
            name: string;
            url: string;
            createdAt: Date;
            updatedAt: Date;
            id: string;
            folderId: string | null;
            slug: string;
            status: boolean;
        }[];
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
    updateFolder: (id: string, payload: any) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
    deleteFolder: (id: string) => Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: string;
        slug: string;
        status: boolean;
        parentId: string | null;
    }>;
};
//# sourceMappingURL=folder.services.d.ts.map