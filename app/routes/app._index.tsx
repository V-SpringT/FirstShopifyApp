import { useEffect, useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  DataTable,
  Pagination,
  Text
} from "@shopify/polaris";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { getAllRatingApp } from "~/utils/Rating.server";
import { getAllAvgRating } from "~/utils/AvgRating.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const ratings = await getAllRatingApp();
  const avgRatings = await getAllAvgRating();
  return { ratings, avgRatings };
};

export default function Index() {
  const rowsPerPage = 5;
  const { ratings, avgRatings }: any = useLoaderData(); // Lấy dữ liệu ở đây

  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);
  const [status, setStatus] = useState(false);

  const [tableData1, setTableData1] = useState<any[]>([]);
  const [tableData2, setTableData2] = useState<any[]>([]);

  const deleteRecord = async ({ shop, ProductId, CustomerId, _action }: any) => {
    // try {
        fetch(`/app/delete/${shop}/${ProductId}/${CustomerId}/${_action}`, 
          {
            method: 'POST',
          })
        .then(response => response.json())
        .then(result => {
          console.log("result", result);
          setStatus(!status)
        })
        .catch(error => console.log("error", error));
    // } catch (error) {
    //   console.error("Error deleting product:", error);
    // }
    
  };

  useEffect(() => {
    const pagination = () => {
      const leftTableData: any[] = [];
      const rightTableData: any[] = [];
      // Populate left table
      avgRatings.forEach((rating: any, idx: number) => {
        leftTableData.push([
          idx + 1,
          rating.shop,
          rating.productId,
          rating.avgStar,
          rating.reviewTotal,
          <Form method="post" key={`${rating.shop}-${rating.productId}`} action={`/app/delete/${rating.shop}/${rating.productId}/none/AvgRating`}>
          <button
            type="submit"
            name="_method"
            value="delete"
            onClick={() =>
              confirm("Are you sure you want to delete this record?")
            }
          >
            Xóa
          </button>
        </Form>
        ]);
      });

      // Populate right table
      ratings.forEach((rating: any, idx: number) => {
        rightTableData.push([
          idx + 1,
          rating.shop,
          rating.ProductId,
          rating.CustomerId,
          rating.star,
          <Form method="post" key={`${rating.shop}-${rating.ProductId}-${rating.CustomerId}`} action={`/app/delete/${rating.shop}/${rating.ProductId}/${rating.CustomerId}/Rating`}>
          <button
            type="submit"
            name="_method"
            value="delete"
            onClick={() =>
              confirm("Are you sure you want to delete this record?")
            }
          >
            Xóa
          </button>
        </Form>
        ]);
      });

      // Handle pagination for left table
      const leftStartIndex = (pageLeft - 1) * rowsPerPage;
      const leftEndIdx = Math.min(leftStartIndex + rowsPerPage, leftTableData.length);
      setTableData1(leftTableData.slice(leftStartIndex, leftEndIdx));

      // Handle pagination for right table
      const rightStartIndex = (pageRight - 1) * rowsPerPage;
      const rightEndIdx = Math.min(rightStartIndex + rowsPerPage, rightTableData.length);
      setTableData2(rightTableData.slice(rightStartIndex, rightEndIdx));
    };

    pagination();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pageLeft, pageRight, ratings, avgRatings]); 

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="headingLg" as="h2">Bảng 1: Thông tin đánh giá sản phẩm</Text>
            <DataTable
              columnContentTypes={['numeric', 'text', 'text', 'numeric', 'numeric', 'text']}
              headings={['STT', 'Shop', 'Product', 'Avg Rating', 'Review Total', '']}
              rows={tableData1}
            />
            <Pagination
              hasPrevious={pageLeft > 1}
              onPrevious={() => setPageLeft(pageLeft - 1)}
              hasNext={avgRatings.length > pageLeft * rowsPerPage}
              onNext={() => setPageLeft(pageLeft + 1)}
            />
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <Text variant="headingLg" as="h2">Bảng 2: Thông tin khách hàng đánh giá</Text>
            <DataTable
              columnContentTypes={['text', 'text', 'text', 'text', 'numeric', 'text']}
              headings={['STT', 'Shop', 'Product', 'Customer', 'Star', '']}
              rows={tableData2}
            />
            <Pagination
              hasPrevious={pageRight > 1}
              onPrevious={() => setPageRight(pageRight - 1)}
              hasNext={ratings.length > pageRight * rowsPerPage}
              onNext={() => setPageRight(pageRight + 1)}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
