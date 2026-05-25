export declare const BlogServices: {
    createBlog: (payload: any) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        id: string;
        description: string | null;
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        excerpt: string | null;
        authorName: string | null;
        authorId: string | null;
        content: string;
        coverImage: string | null;
        authorImage: string | null;
        publishedAt: Date | null;
    }>;
    getAllBlog: (query: any) => Promise<{
        data: {
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            id: string;
            description: string | null;
            slug: string;
            title: string;
            tags: string[];
            isPublished: boolean;
            excerpt: string | null;
            authorName: string | null;
            authorId: string | null;
            content: string;
            coverImage: string | null;
            authorImage: string | null;
            publishedAt: Date | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getBlogById: (id: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        id: string;
        description: string | null;
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        excerpt: string | null;
        authorName: string | null;
        authorId: string | null;
        content: string;
        coverImage: string | null;
        authorImage: string | null;
        publishedAt: Date | null;
    }>;
    updateBlog: (id: string, payload: any) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        id: string;
        description: string | null;
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        excerpt: string | null;
        authorName: string | null;
        authorId: string | null;
        content: string;
        coverImage: string | null;
        authorImage: string | null;
        publishedAt: Date | null;
    }>;
    deleteBlog: (id: string) => Promise<{
        message: string;
    }>;
    updateBlogStatus: (id: string) => Promise<{
        createdAt: Date;
        updatedAt: Date;
        category: string | null;
        id: string;
        description: string | null;
        slug: string;
        title: string;
        tags: string[];
        isPublished: boolean;
        excerpt: string | null;
        authorName: string | null;
        authorId: string | null;
        content: string;
        coverImage: string | null;
        authorImage: string | null;
        publishedAt: Date | null;
    }>;
};
//# sourceMappingURL=blog.service.d.ts.map