import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.join(current_dir, '..')
sys.path.append(parent_dir)

from app.auth import hash_password
from app.models import DiscussionThread, User

import asyncio
from dotenv import dotenv_values
from random import randint
import shutil
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from time import time

config = dotenv_values(".env")
DATABASE_URL = "postgresql+asyncpg://{}:{}@{}:{}/{}".format(
    config.get("DB_USER"),
    config.get("DB_PASSWORD"),
    config.get("DB_HOST"),
    config.get("DB_PORT"),
    config.get("DB_NAME"),
)

async_engine = create_async_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
async_session = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)

def random_content():
    contents = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse interdum nunc arcu, quis consectetur ex viverra ornare. In mollis leo eget sapien dapibus sagittis. Vestibulum at orci justo. Quisque eget facilisis neque. Nunc malesuada odio ex, quis convallis purus placerat vitae. Donec non magna sed metus ullamcorper mollis vel id erat. Donec eget odio massa. Ut tincidunt blandit nunc id sodales. Donec ac faucibus tortor. Integer sit amet massa ac leo imperdiet tincidunt et quis augue. Etiam tempor neque id lacinia tincidunt. Donec eu quam luctus, suscipit arcu at, ullamcorper neque. Nullam quam arcu, porttitor non mi et, dictum maximus urna. Fusce dictum eleifend augue a condimentum. Fusce quis congue purus, ut tincidunt libero.",
        "Suspendisse eget lacus in urna tempus tincidunt. Pellentesque eu euismod leo. Praesent at elit massa. Nullam porta sodales sem sit amet ullamcorper. Suspendisse id vulputate risus. Mauris gravida aliquam mauris, eget rhoncus felis convallis in. Duis pretium odio turpis, vel ullamcorper odio vestibulum non. Fusce volutpat eros quis risus molestie, nec semper felis aliquet. Curabitur id tortor et purus egestas auctor eu in nisl. Vivamus venenatis justo at pharetra luctus. Nullam sagittis, elit vel pulvinar sollicitudin, eros orci tincidunt dolor, quis posuere nibh metus id purus. Integer pulvinar quis dui non malesuada. Duis interdum quam sit amet tortor venenatis, sed volutpat ipsum sodales. Mauris tincidunt justo quis leo vestibulum, vel congue leo congue.",
        "Etiam at neque tristique sapien mattis efficitur ac a libero. Donec ac purus cursus, semper enim at, posuere purus. Mauris eu elit ac nunc cursus porta. Proin porta pharetra elementum. Fusce ut dui elit. Pellentesque sed pulvinar mi. Nulla sed lobortis mauris. Ut non dolor eu turpis varius gravida eu ac dolor. Etiam ornare malesuada blandit. Nunc congue a diam placerat volutpat. Ut ac ipsum vitae dui porta tincidunt sed ut tortor. Mauris purus quam, faucibus a mauris ac, maximus imperdiet metus. Integer rutrum sed erat viverra sagittis. Mauris ornare dignissim sem, vel auctor massa dictum ut.",
        "Fusce accumsan non orci nec pellentesque. Mauris tempor odio a felis condimentum porta ut ac urna. Nunc tristique pellentesque sem, sed rutrum nunc consectetur a. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent lacinia ac eros non facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in lectus eu dolor ultrices venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur tincidunt, ante nec tempor efficitur, nunc ex convallis augue, a feugiat nunc ex at massa. In ultricies quam vulputate ex ultricies, eget laoreet ipsum dictum. Maecenas id mattis libero, non laoreet quam. Nam quis fringilla augue, nec laoreet lectus.",
        "Mauris maximus, turpis ut ornare gravida, risus eros malesuada odio, ac porta massa purus in sapien. Donec sem eros, tristique non magna nec, maximus aliquet sem. Sed aliquet, lorem a luctus rhoncus, mauris lacus sollicitudin nulla, sed volutpat eros erat eu leo. Integer viverra pharetra leo, et interdum diam interdum non. In aliquam ex eu lectus ultrices, ut hendrerit lacus volutpat. Pellentesque interdum, nulla sed varius ultricies, massa lorem pretium turpis, in ultrices ante sapien et risus. Aliquam erat volutpat. In elementum tincidunt nunc, vel suscipit orci bibendum malesuada. Integer vitae eleifend quam. Nunc pellentesque ante id ligula fringilla viverra. Donec suscipit urna ac neque vestibulum eleifend. Vestibulum luctus turpis nulla, pretium lobortis lectus placerat eget. Phasellus imperdiet nunc elit, in maximus purus porttitor sit amet. Nulla lacus dolor, aliquet ut tempor mollis, feugiat quis lectus. Pellentesque iaculis purus et turpis viverra, eu feugiat orci gravida.",
    ]
    return contents[randint(0, 4)]

def get_image_path(username, discussion_thread_title):
    images = [
        "bithound.svg",
        "bower2.svg",
        "browserslist.svg",
        "cakephp.svg",
        "python.svg",
    ]
    image = images[randint(0, 4)]
    config = dotenv_values(".env")
    image_path = "{}/{}_{}_{}.svg".format(
        config.get("IMAGE_PATH"),
        int(time()),
        username,
        discussion_thread_title,
    )
    shutil.copy(f"./seeds/images/{image}", f".{image_path}")
    return image_path

async def create_dummy_users():
    dummy_users = []
    async with async_session() as session:
        for n in range(1, 5):
            dummy_user = User(username=f"User {n}", hashed_password=hash_password(f"user{n}pw"))
            dummy_users.append(dummy_user)
            session.add(dummy_user)
        await session.commit()
    return dummy_users

async def create_dummy_threads(dummy_users):
    async with async_session() as session:
        for n in range(1, 11):
            user = dummy_users[randint(0, 3)]
            title = f"Thread {n}"
            dummy_discussion_thread = DiscussionThread(
                user_id=user.id,
                title=title,
                content=random_content(),
                image_path=get_image_path(user.username, title),
            )
            session.add(dummy_discussion_thread)
        await session.commit()

async def seed_dummy_data():
    dummy_users = await create_dummy_users()
    await create_dummy_threads(dummy_users)

async def clear_data():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

async def main():
    await clear_data()
    await seed_dummy_data()

if __name__ == "__main__":
    asyncio.run(main())
