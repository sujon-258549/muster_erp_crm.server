import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createModule = (moduleName: string): void => {
  const baseDir = path.join(__dirname, "../", "app", "modules", moduleName);
  const moduleBase = path.basename(moduleName);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
    console.log(`📁 Directory created: ${baseDir}`);
  } else {
    console.log(`⚠️ Directory already exists: ${baseDir}`);
  }

  const capName = capitalize(moduleBase);
  const prismaModel = moduleBase.charAt(0).toLowerCase() + moduleBase.slice(1);

  const files: Record<string, string> = {
    // 🚩 Constant file — searchable/filterable fields
    [`${moduleBase}.constant.ts`]: `export const ${moduleBase}FilterableFields = [
  "searchTerm",
  "name",
  "isActive",
];

export const ${moduleBase}SearchableFields = ["name", "description"];
`,

    // 🚩 Interface
    [`${moduleBase}.interface.ts`]: `export type I${capName}FilterRequest = {
  searchTerm?: string | undefined;
  name?: string | undefined;
  isActive?: boolean | undefined;
};

export interface I${capName} {
  id: string;
  branchId?: string | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
`,

    // 🚩 Validation (Zod)
    [`${moduleBase}.validation.ts`]: `import { z } from "zod";

const create${capName}ZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const update${capName}ZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ${capName}Validation = {
  create${capName}ZodSchema,
  update${capName}ZodSchema,
};
`,

    // 🚩 Service file — tenant-aware (SaaS pattern)
    [`${moduleBase}.service.ts`]: `import type { Prisma } from "../../../generated/prisma/client.js";
import httpStatus from "http-status";
import ApiError from "../../middleware/apiError.ts";
import prisma from "../../utils/prismaClient.ts";
import { calculatePaginationOrSort } from "../../../shared/calculatePaginationOrSort.tsx";
import { ${moduleBase}SearchableFields } from "./${moduleBase}.constant.ts";
import type { ActorContext } from "../../utils/tenant.ts";
import { tenantFilter, assertTenantAccess } from "../../utils/tenant.ts";

const create${capName}IntoDB = async (payload: any, actor: ActorContext) => {
  const result = await prisma.${prismaModel}.create({
    data: {
      ...payload,
      branchId: actor.branchId ?? null,
    },
  });
  return result;
};

const getAll${capName} = async (query: any, actor: ActorContext) => {
  const { page, limit, searchTerm, sortBy, sortOrder, ...filter } = query;

  const andCondition: Prisma.${capName}WhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: ${moduleBase}SearchableFields.map((text: string) => ({
        [text]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  const { pageNumber, limitNumber, skip, sortOrderValue, sortByValue } =
    calculatePaginationOrSort(page, limit, sortBy, sortOrder);

  const where: Prisma.${capName}WhereInput = {
    AND: andCondition.length > 0 ? andCondition : undefined,
    ...filter,
    ...tenantFilter(actor),
  };

  const result = await prisma.${prismaModel}.findMany({
    where,
    take: limitNumber,
    skip,
    orderBy: { [sortByValue]: sortOrderValue },
  });

  const total = await prisma.${prismaModel}.count({ where });

  return {
    data: result,
    meta: { page: pageNumber, limit: limitNumber, total },
  };
};

const get${capName}ById = async (id: string, actor: ActorContext) => {
  const result = await prisma.${prismaModel}.findUnique({ where: { id } });
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, "${capName} not found");
  assertTenantAccess(actor, result.branchId);
  return result;
};

const update${capName} = async (
  id: string,
  payload: any,
  actor: ActorContext,
) => {
  const existing = await prisma.${prismaModel}.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "${capName} not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.${prismaModel}.update({
    where: { id },
    data: payload,
  });
  return result;
};

const delete${capName} = async (id: string, actor: ActorContext) => {
  const existing = await prisma.${prismaModel}.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "${capName} not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.${prismaModel}.delete({ where: { id } });
  return result;
};

const update${capName}Status = async (id: string, actor: ActorContext) => {
  const existing = await prisma.${prismaModel}.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "${capName} not found");
  assertTenantAccess(actor, existing.branchId);

  const result = await prisma.${prismaModel}.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });
  return result;
};

export const ${capName}Services = {
  create${capName}IntoDB,
  getAll${capName},
  get${capName}ById,
  update${capName},
  delete${capName},
  update${capName}Status,
};
`,

    // 🚩 Controller file — uses project's sendResponse + catchAsync + actorFromReq
    [`${moduleBase}.controller.ts`]: `import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { pick } from "../../../shared/pick.ts";
import { ${moduleBase}FilterableFields } from "./${moduleBase}.constant.ts";
import catchAsync from "../../shared/catchAsync.ts";
import { ${capName}Services } from "./${moduleBase}.service.ts";
import sendResponse from "../../utils/response.ts";
import { actorFromReq } from "../../utils/tenant.ts";

const create${capName} = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await ${capName}Services.create${capName}IntoDB(
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "${capName} created successfully",
      data: result,
    });
  },
);

const getAll${capName} = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = pick(req.query, [
      ...${moduleBase}FilterableFields,
      "page",
      "limit",
      "sortBy",
      "sortOrder",
    ]);
    const result = await ${capName}Services.getAll${capName}(
      query,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "${capName} retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const get${capName}ById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ${capName}Services.get${capName}ById(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "${capName} retrieved successfully",
      data: result,
    });
  },
);

const update${capName} = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ${capName}Services.update${capName}(
      id as string,
      req.body,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "${capName} updated successfully",
      data: result,
    });
  },
);

const delete${capName} = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ${capName}Services.delete${capName}(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "${capName} deleted successfully",
      data: result,
    });
  },
);

const update${capName}Status = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await ${capName}Services.update${capName}Status(
      id as string,
      actorFromReq(req),
    );
    sendResponse(res, {
      success: true,
      statusCode: status.OK,
      message: "${capName} status updated successfully",
      data: result,
    });
  },
);

export const ${capName}Controller = {
  create${capName},
  getAll${capName},
  get${capName}ById,
  update${capName},
  delete${capName},
  update${capName}Status,
};
`,

    // 🚩 Routes file — auth() + validateRequest()
    [`${moduleBase}.routes.ts`]: `import { Router } from "express";
import { ${capName}Controller } from "./${moduleBase}.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { ${capName}Validation } from "./${moduleBase}.validation.ts";
import auth from "../../utils/auth.ts";

const router = Router();
s
router.post(
  "/",
  auth(),
  validateRequest(${capName}Validation.create${capName}ZodSchema),
  ${capName}Controller.create${capName},
);
router.get("/", auth(), ${capName}Controller.getAll${capName});
router.get("/:id", auth(), ${capName}Controller.get${capName}ById);
router.put(
  "/:id",
  auth(),
  validateRequest(${capName}Validation.update${capName}ZodSchema),
  ${capName}Controller.update${capName},
);
router.delete("/:id", auth(), ${capName}Controller.delete${capName});
router.patch("/:id/status", auth(), ${capName}Controller.update${capName}Status);

export const ${capName}Routes = router;
`,
  };

  Object.entries(files).forEach(([fileName, content]) => {
    const filePath = path.join(baseDir, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, "utf-8");
      console.log(`✅ File created: ${filePath}`);
    } else {
      console.log(`⚠️ File already exists: ${filePath}`);
    }
  });

  console.log(`\n📌 Next step — register the route in src/app/router/index.ts:\n`);
  console.log(
    `   import { ${capName}Routes } from "../modules/${moduleBase}/${moduleBase}.routes.ts";`,
  );
  console.log(
    `   // then add inside allRouter: { path: "/${moduleBase}", router: ${capName}Routes },\n`,
  );
};

const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const moduleName = process.argv[2];
if (!moduleName) {
  console.error("❌ Please provide a module name.");
  process.exit(1);
}

createModule(moduleName);
