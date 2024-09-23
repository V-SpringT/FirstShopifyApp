import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
// import { json } from "@remix-run/node";
import {
  Page,
  Layout,
  Card,
  Button,
  DataTable,
  Pagination,
  Text
} from "@shopify/polaris";
// import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

import { getAllRatingApp } from "../utils/Rating.server";
import { useLoaderData } from "@remix-run/react";
import { getAllAvgRating } from "~/utils/AvgRating.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const ratings = await getAllRatingApp();
  const avgRatings = await getAllAvgRating();
  return {ratings : ratings, avgRatings: avgRatings};
};

// export const action = async ({ request }: ActionFunctionArgs) => {
 
// };






export default function Index() {
  const rowsPerPage = 5; 

  const {ratings, avgRatings} : any= useLoaderData()
  const [pageLeft, setPageLeft] = useState(1);
  const [pageRight, setPageRight] = useState(1);

  const leftTableData: any = [];
  const rightTableData: any = [];

  // const deleteRatingRecord = ({shop, ProductId, CustomerId})=>{

  // }
  const deleteAvgRatingRecord = async ({shop, ProductId}: any)=>{
    console.log(shop, ProductId)
    // try {
    //   const response = await fetch(``, {
    //     method: 'DELETE',
    //   });

    //   if (response.ok) {
    //     console.log("ok haaaa")
    //   } else {
    //     throw new Error('Failed to delete the product');
    //   }
    // } catch (error) {
    //   console.error('Error deleting product:', error);
    // }
  }


  avgRatings.forEach((rating: any, idx: number)=> {
      leftTableData.push([idx+1, rating.shop, rating.productId, rating.avgStar, 
        rating.reviewTotal, 
        <Button key={`${rating.shop}-${rating.productId}`} onClick={()=>{deleteAvgRatingRecord({shop: rating.shop,ProductId: rating.productId})}}>Xóa</Button>])
  });
  ratings.forEach((rating: any, idx: number)=> {
    rightTableData.push([idx+1, rating.shop, rating.ProductId, 
      rating.CustomerId, rating.star,
      <Button key={`${rating.shop}-${rating.ProductId}-${rating.CustomerId}`}>Xóa</Button>])
});

  const leftStartIndex = (pageLeft - 1) * rowsPerPage;
  const leftEndIdx = (leftStartIndex + rowsPerPage) <= leftTableData.length ? (leftStartIndex + rowsPerPage ) : leftTableData.length
  const leftCurrentPageData = leftTableData.slice(leftStartIndex, leftEndIdx);

  const rightStartIndex = (pageRight - 1) * rowsPerPage;
  const rightEndIdx = (rightStartIndex + rowsPerPage) <=rightTableData.length? (rightStartIndex + rowsPerPage): rightTableData.length
  const rightCurrentPageData = rightTableData.slice(rightStartIndex, rightEndIdx);
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="headingLg" as="h2">Bảng 1: Thông tin đánh giá sản phẩm</Text>
            <DataTable
              columnContentTypes={['numeric', 'text', 'text', 'numeric', 'numeric', 'text']}
              headings={['STT', 'Shop', 'Product', 'Avg Rating', 'Review Total', '']}
              rows={leftCurrentPageData}
            />
            <Pagination
              hasPrevious={pageLeft > 1}
              onPrevious={() => setPageLeft(pageLeft - 1)}
              hasNext={leftTableData.length > pageLeft * rowsPerPage}
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
              rows={rightCurrentPageData}
            />
            <Pagination
              hasPrevious={pageRight > 1}
              onPrevious={() => setPageRight(pageRight - 1)}
              hasNext={rightTableData.length > pageRight * rowsPerPage}
              onNext={() => setPageRight(pageRight + 1)}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}